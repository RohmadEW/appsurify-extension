import { useQuery } from "@tanstack/react-query";
import { getTestcaseById } from "../../api/testcase/getTestcaseById";
import { useAppSelector } from "../useStore";

interface Props {
  id: number;
}

export const useTestcaseById = ({ id }: Props) => {
  const { team } = useAppSelector((state) => state.team);
  const { project } = useAppSelector((state) => state.project);
  const { testsuite } = useAppSelector((state) => state.testsuite);

  return useQuery({
    queryKey: ["testcase", id, team, project, testsuite],
    queryFn: () =>
      team && project && testsuite
        ? getTestcaseById({ team, project, testsuite, id })
        : undefined,
    enabled: !!team && !!project,
  });
};
