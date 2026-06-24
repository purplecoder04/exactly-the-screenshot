import { useCallback, useMemo } from "react";
import { useLocalState } from "./useLocalState";
import { STORAGE_KEYS, newId, nowISO } from "@/lib/storage";
import { SAMPLE_TASKS } from "@/data/sampleData";
import { areaTypeFor, type TaskItem, type WorkspaceArea } from "@/lib/types";

export function useTasks() {
  const [tasks, setTasks] = useLocalState<TaskItem[]>(STORAGE_KEYS.tasks, SAMPLE_TASKS);

  const addTask = useCallback(
    (data: Partial<TaskItem> & { title: string; branch: WorkspaceArea }) => {
      const t: TaskItem = {
        id: newId("t"),
        title: data.title,
        branch: data.branch,
        areaType: data.areaType ?? areaTypeFor(data.branch),
        project: data.project,
        type: data.type ?? "Task",
        status: data.status ?? "Idea",
        priority: data.priority ?? "Medium",
        nextStep: data.nextStep ?? "",
        notes: data.notes ?? "",
        isToday: data.isToday ?? false,
        isDone: data.isDone ?? false,
        createdAt: nowISO(),
        updatedAt: nowISO(),
        completedAt: data.completedAt,
        rolloverCount: data.rolloverCount ?? 0,
      };
      setTasks((prev) => [t, ...prev]);
      return t;
    },
    [setTasks],
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<TaskItem>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: nowISO() } : t)),
      );
    },
    [setTasks],
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks],
  );

  const toggleDone = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                isDone: !t.isDone,
                status: !t.isDone ? "Done" : t.status === "Done" ? "Writing" : t.status,
                completedAt: !t.isDone ? nowISO() : undefined,
                updatedAt: nowISO(),
              }
            : t,
        ),
      );
    },
    [setTasks],
  );

  const moveToToday = useCallback(
    (id: string) => updateTask(id, { isToday: true }),
    [updateTask],
  );

  const removeFromToday = useCallback(
    (id: string) => updateTask(id, { isToday: false }),
    [updateTask],
  );

  const endDayRollover = useCallback(() => {
    setTasks((prev) =>
      prev.map((t) => {
        if (!t.isToday) return t;
        if (t.isDone) {
          return {
            ...t,
            isToday: false,
            completedAt: t.completedAt ?? nowISO(),
            updatedAt: nowISO(),
          };
        }
        return {
          ...t,
          rolloverCount: (t.rolloverCount ?? 0) + 1,
          updatedAt: nowISO(),
        };
      }),
    );
  }, [setTasks]);

  const stats = useMemo(() => {
    const active = tasks.filter((t) => !t.isDone).length;
    const inProgress = tasks.filter((t) => ["Writing", "Outline"].includes(t.status)).length;
    const waiting = tasks.filter((t) => t.status === "Waiting").length;
    const testing = tasks.filter((t) => t.status === "Testing").length;
    const completed = tasks.filter((t) => t.isDone).length;
    return { active, inProgress, waiting, testing, completed };
  }, [tasks]);

  return {
    tasks,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleDone,
    moveToToday,
    removeFromToday,
    endDayRollover,
    stats,
  };
}
