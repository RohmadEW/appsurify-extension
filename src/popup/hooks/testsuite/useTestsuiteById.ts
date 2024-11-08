import { useQuery } from "@tanstack/react-query";
import { getTestsuiteById } from "../../api/testsuite/getTestsuiteById";
import { useAppSelector } from "../useStore";

interface Props {
  id: number;
}

export const useTestsuiteById = ({ id }: Props) => {
  const { team } = useAppSelector((state) => state.team);
  const { project } = useAppSelector((state) => state.project);

  return useQuery({
    queryKey: ["testsuite", id, team, project],
    queryFn: () =>
      team && project ? getTestsuiteById({ team, project, id }) : undefined,
    enabled: !!team && !!project,
  });
};
