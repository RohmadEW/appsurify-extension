import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "../../api/project/getProjectById";
import { useAppSelector } from "../useStore";

interface Props {
  id: number;
}

export const useProjectById = ({ id }: Props) => {
  const { team } = useAppSelector((state) => state.team);

  return useQuery({
    queryKey: ["project", id, team],
    queryFn: () => (team ? getProjectById({ id, team }) : undefined),
    enabled: !!team,
  });
};
