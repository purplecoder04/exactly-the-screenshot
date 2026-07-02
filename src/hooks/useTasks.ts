import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { nowISO } from "@/lib/storage";
import { areaTypeFor, type TaskItem, type WorkspaceArea } from "@/lib/types";
import { rowToTask, taskPatchToUpdate, taskToInsert, type TaskRow } from "@/lib/mappers/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("[useTasks] load failed", error);
        return;
      }
      setTasks((data as TaskRow[]).map(rowToTask));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addTask = useCallback(
    (data: Partial<TaskItem> & { title: string; branch: WorkspaceArea }) => {
      const payload = taskToInsert({ ...data, areaType: data.areaType ?? areaTypeFor(data.branch) });
      const optimistic: TaskItem = {
        id: `tmp_${Date.now()}`,
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
        isDone: (data.status ?? "Idea") === "Done",
        createdAt: nowISO(),
        updatedAt: nowISO(),
        rolloverCount: 0,
      };
      setTasks((prev) => [optimistic, ...prev]);
      void supabase
        .from("tasks")
        .insert(payload)
        .select()
        .single()
        .then(({ data: row, error }) => {
          if (error || !row) {
            console.error("[useTasks] add failed", error);
            setTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
            return;
          }
          setTasks((prev) => prev.map((t) => (t.id === optimistic.id ? rowToTask(row as TaskRow) : t)));
        });
      return optimistic;
    },
    [],
  );

  const updateTask = useCallback((id: string, patch: Partial<TaskItem>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: nowISO() } : t)));
    const upd = taskPatchToUpdate(patch);
    if (Object.keys(upd).length === 0) return;
    void supabase
      .from("tasks")
      .update(upd)
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("[useTasks] update failed", error);
      });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    void supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("[useTasks] delete failed", error);
      });
  }, []);

  const toggleDone = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const target = prev.find((t) => t.id === id);
        if (!target) return prev;
        const nowDone = !target.isDone;
        const nextStatus = nowDone ? "Done" : target.status === "Done" ? "Writing" : target.status;
        void supabase
          .from("tasks")
          .update({ status: nextStatus })
          .eq("id", id)
          .then(({ error }) => {
            if (error) console.error("[useTasks] toggle failed", error);
          });
        return prev.map((t) =>
          t.id === id
            ? {
                ...t,
                isDone: nowDone,
                status: nextStatus,
                completedAt: nowDone ? nowISO() : undefined,
                updatedAt: nowISO(),
              }
            : t,
        );
      });
    },
    [],
  );

  const moveToToday = useCallback((id: string) => updateTask(id, { isToday: true }), [updateTask]);
  const removeFromToday = useCallback((id: string) => updateTask(id, { isToday: false }), [updateTask]);

  const endDayRollover = useCallback(() => {
    setTasks((prev) => {
      const updates: Array<{ id: string; is_today: boolean }> = [];
      const next = prev.map((t) => {
        if (!t.isToday) return t;
        if (t.isDone) {
          updates.push({ id: t.id, is_today: false });
          return { ...t, isToday: false, completedAt: t.completedAt ?? nowISO(), updatedAt: nowISO() };
        }
        return { ...t, rolloverCount: (t.rolloverCount ?? 0) + 1, updatedAt: nowISO() };
      });
      updates.forEach((u) => {
        void supabase.from("tasks").update({ is_today: u.is_today }).eq("id", u.id);
      });
      return next;
    });
  }, []);

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
