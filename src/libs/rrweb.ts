export const rrwebRecord = (function () {
  "use strict"

  enum NodeType {
    Document = 0,
    DocumentType = 1,
    Element = 2,
    Text = 3,
    CDATA = 4,
    Comment = 5
  }

  let nodeId = 1
  const urlRegex = /url\((['"]|)([^'"]*)\1\)/gm
  const relativeUrlRegex = /^(?!www\.|(?:http|ftp)s?:\/\/|[A-Za-z]:\\|\/\/).*/

  function resolveUrl(url: string, baseUrl: string): string {
    return url.replace(urlRegex, (match, quote, path) => {
      if (!relativeUrlRegex.test(path)) return `url('${path}')`
      if (path[0] === "/") {
        const base =
          baseUrl.indexOf("//") > -1
            ? baseUrl.split("/").slice(0, 3).join("/")
            : baseUrl.split("/")[0]
        return `url('${base.split("?")[0] + path}')`
      }
      const baseParts = baseUrl.split("/")
      const pathParts = path.split("/")
      baseParts.pop()
      for (const part of pathParts) {
        if (part === ".") continue
        if (part === "..") baseParts.pop()
        else baseParts.push(part)
      }
      return `url('${baseParts.join("/")})`
    })
  }

  function getAbsoluteUrl(doc: Document, url: string): string {
    const a = doc.createElement("a")
    a.href = url
    return a.href
  }

  const rrBlockClass = "rr-block"

  function serializeNode(node: Node, doc: Document): any {
    switch (node.nodeType) {
      case Node.DOCUMENT_NODE:
        return { type: NodeType.Document, childNodes: [] }
      case Node.DOCUMENT_TYPE_NODE:
        return {
          type: NodeType.DocumentType,
          name: (node as DocumentType).name,
          publicId: (node as DocumentType).publicId,
          systemId: (node as DocumentType).systemId
        }
      case Node.ELEMENT_NODE:
        const element = node as Element
        const isBlocked = element.classList.contains(rrBlockClass)
        const tagName = element.tagName.toLowerCase()
        const attributes: { [key: string]: string } = {}
        for (const attr of Array.from(element.attributes)) {
          attributes[attr.name] =
            attr.name === "src" || attr.name === "href"
              ? getAbsoluteUrl(doc, attr.value)
              : attr.value
        }
        if (tagName === "link") {
          const stylesheet = Array.from(doc.styleSheets).find(
            (s) => (s as CSSStyleSheet).href === element.getAttribute("href")
          ) as CSSStyleSheet
          const cssText = getCssText(stylesheet)
          if (cssText)
            attributes._cssText = resolveUrl(cssText, stylesheet.href!)
        }
        if (["input", "textarea", "select"].includes(tagName)) {
          const inputElement = element as HTMLInputElement
          if (inputElement.value) attributes.value = inputElement.value
          if (inputElement.checked)
            attributes.checked = inputElement.checked.toString()
        }
        if (tagName === "option") {
          const parentElement = element.parentElement as HTMLSelectElement
          if (attributes.value === parentElement.value)
            attributes.selected = (
              element as HTMLOptionElement
            ).selected.toString()
        }
        if (isBlocked) {
          const rect = element.getBoundingClientRect()
          attributes.rr_width = `${rect.width}px`
          attributes.rr_height = `${rect.height}px`
        }
        return {
          type: NodeType.Element,
          tagName,
          attributes,
          childNodes: [],
          isSVG: element instanceof SVGElement,
          needBlock: isBlocked
        }
      case Node.TEXT_NODE:
        const parentTagName =
          node.parentNode && (node.parentNode as Element).tagName
        let textContent = node.textContent || ""
        if (parentTagName === "STYLE")
          textContent = resolveUrl(textContent, location.href)
        if (parentTagName === "SCRIPT") textContent = "SCRIPT_PLACEHOLDER"
        return {
          type: NodeType.Text,
          textContent,
          isStyle: parentTagName === "STYLE"
        }
      case Node.CDATA_SECTION_NODE:
        return { type: NodeType.CDATA, textContent: "" }
      case Node.COMMENT_NODE:
        return { type: NodeType.Comment, textContent: node.textContent || "" }
      default:
        return false
    }
  }

  function getCssText(stylesheet: CSSStyleSheet): string | null {
    try {
      const rules = stylesheet.rules || stylesheet.cssRules
      return rules
        ? Array.from(rules).reduce((css, rule) => css + rule.cssText, "")
        : null
    } catch {
      return null
    }
  }

  function serializeNodeWithId(
    node: Node,
    doc: Document,
    map: { [key: number]: Node },
    skipChildNodes = false
  ): any {
    const serializedNode = serializeNode(node, doc)
    if (!serializedNode) {
      console.warn(node, "not serialized")
      return null
    }
    const id = nodeId++
    const nodeWithId = { ...serializedNode, id }
    ;(node as any).__sn = nodeWithId
    map[id] = node
    if (
      !skipChildNodes &&
      (nodeWithId.type === NodeType.Document ||
        nodeWithId.type === NodeType.Element)
    ) {
      for (const child of Array.from(node.childNodes)) {
        const serializedChild = serializeNodeWithId(child, doc, map)
        if (serializedChild) nodeWithId.childNodes.push(serializedChild)
      }
    }
    return nodeWithId
  }

  function snapshot(doc: Document): [any, { [key: number]: Node }] {
    nodeId = 1
    const map: { [key: number]: Node } = {}
    return [serializeNodeWithId(doc, doc, map), map]
  }

  function addEventListenerWithOptions(
    event: string,
    handler: EventListener,
    target: EventTarget = document
  ): () => void {
    const options = { capture: true, passive: true }
    target.addEventListener(event, handler, options)
    return () => target.removeEventListener(event, handler, options)
  }

  const mirror = {
    map: {} as { [key: number]: Node },
    getId(node: Node): number {
      return (node as any).__sn ? (node as any).__sn.id : -1
    },
    getNode(id: number): Node | null {
      return mirror.map[id] || null
    },
    removeNodeFromMap(node: Node): void {
      const id = (node as any).__sn && (node as any).__sn.id
      delete mirror.map[id]
      if (node.childNodes) {
        node.childNodes.forEach((child) => mirror.removeNodeFromMap(child))
      }
    },
    has(id: number): boolean {
      return mirror.map.hasOwnProperty(id)
    }
  }

  function throttle<T extends (...args: any[]) => void>(
    fn: T,
    wait: number,
    options: { leading?: boolean; trailing?: boolean } = {}
  ): T {
    let timeout: number | null = null
    let previous = 0
    return function (this: any, ...args: any[]) {
      const now = Date.now()
      if (!previous && options.leading === false) previous = now
      const remaining = wait - (now - previous)
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
        previous = now
        fn.apply(this, args)
      } else if (!timeout && options.trailing !== false) {
        timeout = window.setTimeout(() => {
          previous = options.leading === false ? 0 : Date.now()
          timeout = null
          fn.apply(this, args)
        }, remaining)
      }
    } as T
  }

  function getWindowHeight(): number {
    return (
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight
    )
  }

  function getWindowWidth(): number {
    return (
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    )
  }

  function initMouseInteractionObserver(cb: (data: any) => void): () => void {
    const handlers: (() => void)[] = []
    Object.keys(MouseInteractions)
      .filter((key) => isNaN(Number(key)))
      .forEach((key) => {
        const eventName = key.toLowerCase()
        const handler = (event: MouseEvent) => {
          const id = mirror.getId(event.target as Node)
          const x = event.clientX
          const y = event.clientY
          cb({
            type: MouseInteractions[key as keyof typeof MouseInteractions],
            id,
            x,
            y
          })
        }
        handlers.push(addEventListenerWithOptions(eventName, handler))
      })
    return () => handlers.forEach((h) => h())
  }

  enum EventType {
    DomContentLoaded = 0,
    Load = 1,
    FullSnapshot = 2,
    IncrementalSnapshot = 3,
    Meta = 4
  }

  enum IncrementalSource {
    Mutation = 0,
    MouseMove = 1,
    MouseInteraction = 2,
    Scroll = 3,
    ViewportResize = 4,
    Input = 5
  }

  enum MouseInteractions {
    MouseUp = 0,
    MouseDown = 1,
    Click = 2,
    ContextMenu = 3,
    DblClick = 4,
    Focus = 5,
    Blur = 6,
    TouchStart = 7,
    TouchMove = 8,
    TouchEnd = 9
  }

  const inputTags = ["INPUT", "TEXTAREA", "SELECT"]
  const rrIgnoreClass = "rr-ignore"
  const inputMap = new WeakMap<Element, { text: string; isChecked: boolean }>()

  function initInputObserver(cb: (data: any) => void): () => void {
    function handleInput(event: Event): void {
      const target = event.target as HTMLInputElement
      if (target && target.tagName && inputTags.includes(target.tagName)) {
        const type = target.type
        if (type !== "password" && !target.classList.contains(rrIgnoreClass)) {
          const value = target.value
          const isChecked =
            type === "radio" || type === "checkbox" ? target.checked : false
          recordInput(target, { text: value, isChecked })
          if (type === "radio" && target.name && isChecked) {
            document
              .querySelectorAll(`input[type="radio"][name="${target.name}"]`)
              .forEach((radio) => {
                if (radio !== target)
                  recordInput(radio as HTMLInputElement, {
                    text: (radio as HTMLInputElement).value,
                    isChecked: !isChecked
                  })
              })
          }
        }
      }
    }

    function recordInput(
      target: HTMLInputElement,
      data: { text: string; isChecked: boolean }
    ): void {
      const previousData = inputMap.get(target)
      if (
        !previousData ||
        previousData.text !== data.text ||
        previousData.isChecked !== data.isChecked
      ) {
        inputMap.set(target, data)
        const id = mirror.getId(target)
        cb({ ...data, id })
      }
    }

    const handlers = ["input", "change"].map((event) =>
      addEventListenerWithOptions(event, handleInput)
    )
    const inputProperties = [
      [HTMLInputElement.prototype, "value"],
      [HTMLInputElement.prototype, "checked"],
      [HTMLSelectElement.prototype, "value"],
      [HTMLTextAreaElement.prototype, "value"]
    ]
    const propertyHandlers = inputProperties.map(([prototype, property]) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        prototype,
        property as PropertyKey
      )
      if (descriptor && descriptor.set) {
        return overrideProperty(prototype, property as string, {
          set(value: any) {
            setTimeout(() => {
              descriptor.set!.call(this, value)
            }, 0)
            descriptor.set!.call(this, value)
          }
        })
      }
      return () => {}
    })

    return () => {
      handlers.forEach((h) => h())
      propertyHandlers.forEach((h) => h())
    }
  }

  function overrideProperty(
    prototype: any,
    property: string,
    descriptor: PropertyDescriptor
  ): () => void {
    const originalDescriptor = Object.getOwnPropertyDescriptor(
      prototype,
      property
    )
    Object.defineProperty(prototype, property, descriptor)
    return () =>
      Object.defineProperty(prototype, property, originalDescriptor || {})
  }

  function initMutationObserver(cb: (data: any) => void): () => void {
    const observer = new MutationObserver((mutations) => {
      const texts: { value: string; node: Node }[] = []
      const attributes: {
        node: Node
        attributes: { [key: string]: string }
      }[] = []
      const removes: { parentId: number; id: number }[] = []
      const adds: {
        parentId: number
        previousId: number | null
        nextId: number | null
        node: any
      }[] = []
      const movedNodes = new Set<Node>()

      const processNode = (node: Node) => {
        movedNodes.add(node)
        node.childNodes.forEach(processNode)
      }

      mutations.forEach((mutation) => {
        const {
          type,
          target,
          oldValue,
          addedNodes,
          removedNodes,
          attributeName
        } = mutation
        switch (type) {
          case "characterData":
            if (target.textContent !== oldValue)
              texts.push({ value: target.textContent!, node: target })
            break
          case "attributes":
            if ((target as Element).getAttribute(attributeName!) !== oldValue) {
              const attr = attributes.find((a) => a.node === target)
              if (!attr)
                attributes.push({
                  node: target,
                  attributes: {
                    [attributeName!]: (target as Element).getAttribute(
                      attributeName!
                    )!
                  }
                })
              else
                attr.attributes[attributeName!] = (
                  target as Element
                ).getAttribute(attributeName!)!
            }
            break
          case "childList":
            addedNodes.forEach(processNode)
            removedNodes.forEach((node) => {
              if (movedNodes.has(node)) {
                movedNodes.delete(node)
                adds.push({
                  parentId: mirror.getId(node.parentNode!),
                  previousId: node.previousSibling
                    ? mirror.getId(node.previousSibling)
                    : null,
                  nextId: node.nextSibling
                    ? mirror.getId(node.nextSibling)
                    : null,
                  node: serializeNodeWithId(node, document, mirror.map, true)
                })
              } else {
                removes.push({
                  parentId: mirror.getId(target),
                  id: mirror.getId(node)
                })
                mirror.removeNodeFromMap(node)
              }
            })
            break
        }
      })

      cb({
        texts: texts
          .map(({ node, value }) => ({ id: mirror.getId(node), value }))
          .filter(({ id }) => mirror.has(id)),
        attributes: attributes
          .map(({ node, attributes }) => ({
            id: mirror.getId(node),
            attributes
          }))
          .filter(({ id }) => mirror.has(id)),
        removes,
        adds
      })
    })

    observer.observe(document, {
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }

  function createTimestampedEvent<T>(data: T): T & { timestamp: number } {
    return { ...data, timestamp: Date.now() }
  }

  return function init(options: { emit: (data: any) => void }) {
    const { emit } = options
    if (!emit) throw new Error("emit function is required")

    const handlers: (() => void)[] = []

    handlers.push(
      addEventListenerWithOptions("DOMContentLoaded", () => {
        emit(
          createTimestampedEvent({ type: EventType.DomContentLoaded, data: {} })
        )
      })
    )

    const loadHandler = () => {
      emit(
        createTimestampedEvent({
          type: EventType.Meta,
          data: {
            href: window.location.href,
            width: getWindowWidth(),
            height: getWindowHeight()
          }
        })
      )

      const [snapshotData, nodeMap] = snapshot(document)
      if (!snapshotData) return console.warn("Failed to snapshot the document")

      mirror.map = nodeMap

      emit(
        createTimestampedEvent({
          type: EventType.FullSnapshot,
          data: {
            node: snapshotData,
            initialOffset: {
              left: document.documentElement.scrollLeft,
              top: document.documentElement.scrollTop
            }
          }
        })
      )

      handlers.push(
        initMutationObserver((data) =>
          emit(
            createTimestampedEvent({
              type: EventType.IncrementalSnapshot,
              data: { source: IncrementalSource.Mutation, ...data }
            })
          )
        ),
        initMouseInteractionObserver((data) =>
          emit(
            createTimestampedEvent({
              type: EventType.IncrementalSnapshot,
              data: { source: IncrementalSource.MouseInteraction, ...data }
            })
          )
        ),
        addEventListenerWithOptions(
          "scroll",
          throttle((event) => {
            const target = event.target as HTMLElement
            const id = mirror.getId(target)
            if (target === document.documentElement) {
              emit(
                createTimestampedEvent({
                  type: EventType.IncrementalSnapshot,
                  data: {
                    source: IncrementalSource.Scroll,
                    id,
                    x: document.documentElement.scrollLeft,
                    y: document.documentElement.scrollTop
                  }
                })
              )
            } else {
              emit(
                createTimestampedEvent({
                  type: EventType.IncrementalSnapshot,
                  data: {
                    source: IncrementalSource.Scroll,
                    id,
                    x: target.scrollLeft,
                    y: target.scrollTop
                  }
                })
              )
            }
          }, 100)
        ),
        addEventListenerWithOptions(
          "resize",
          throttle(() => {
            emit(
              createTimestampedEvent({
                type: EventType.IncrementalSnapshot,
                data: {
                  source: IncrementalSource.ViewportResize,
                  width: getWindowWidth(),
                  height: getWindowHeight()
                }
              })
            )
          }, 200),
          window
        ),
        initInputObserver((data) =>
          emit(
            createTimestampedEvent({
              type: EventType.IncrementalSnapshot,
              data: { source: IncrementalSource.Input, ...data }
            })
          )
        )
      )
    }

    if (
      document.readyState === "interactive" ||
      document.readyState === "complete"
    ) {
      loadHandler()
    } else {
      handlers.push(
        addEventListenerWithOptions(
          "load",
          () => {
            emit(createTimestampedEvent({ type: EventType.Load, data: {} }))
            loadHandler()
          },
          window
        )
      )
    }

    return () => handlers.forEach((h) => h())
  }
})()
