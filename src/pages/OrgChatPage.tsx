import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { url } from "../constants";
import { useParams, useSearchParams } from "react-router-dom";

interface Task {
  title: string;
  description: string;
  deadline: string;
  department: string;
  worker_id: string;
  goal_id: string;
}

interface Worker {
  id: string;
  name: string;
}

const OrgChatPage: React.FC = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [goalText, setGoalText] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [goalId, setGoalId] = useState<string | null>(null);
  const params = useParams();
  const [searchParams, _] = useSearchParams();

  useEffect(() => {
    axios
      .get(`${url}/get-departments`, {
        params: { organization_id: params.organization_id },
      })
      .then((res) => {
        setDepartments(res.data);
        console.log(res.data);
      });
    axios
      .get(`${url}/get-workers`, {
        params: { organization_id: params.organization_id },
      })
      .then((res) => setWorkers(res.data));
  }, []);

  const handleSubmitGoal = async () => {
    if (!goalText.trim() || !selectedDepartment) return;

    setLoading(true);
    try {
      const res = await axios.post(`${url}/process-goal`, {
        user_id: searchParams.get("user_id"),
        organization_id: params.organization_id,
        department: selectedDepartment,
        message: goalText,
      });

      setTasks(
        res.data.tasks.map((t: any) => ({
          ...t,
          worker_id: "",
          goal_id: res.data.goal_id,
        }))
      );
      setGoalId(res.data.goal_id);
    } catch (e) {
      console.error("Ошибка при генерации задач", e);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkerChange = (index: number, value: string) => {
    if (!tasks) return;
    const updated = [...tasks];
    updated[index].worker_id = value;
    setTasks(updated);
  };

  const handleDeleteTask = (index: number) => {
    if (!tasks) return;
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const handleApprove = async () => {
    if (!tasks) return;
    const allAssigned = tasks.every((t) => t.worker_id);

    if (!allAssigned) {
      alert("Выберите исполнителя для каждой задачи");
      return;
    }

    try {
      await axios.post(`${url}/approve-tasks`, {
        user_id: searchParams.get("user_id"),
        organization_id: params.organization_id,
        goal_id: goalId,
        tasks: tasks.map((t) => ({
          title: t.title,
          description: t.title,
          priority: t.priority,
          worker_id: t.worker_id,
          deadline: new Date(t.deadline).toLocaleDateString(),
        })),
      });

      alert("Задачи согласованы");
      resetAll();
    } catch (e) {
      console.error("Ошибка при отправке задач", e);
    }
  };

  console.log(tasks);

  const resetAll = () => {
    setGoalText("");
    setSelectedDepartment("");
    setTasks(null);
    setGoalId(null);
  };

  return (
    <Box p={4} maxWidth={800} mx="auto">
      {!tasks ? (
        <>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Выберите отдел</InputLabel>
              <Select
                value={selectedDepartment}
                onChange={(e: SelectChangeEvent) =>
                  setSelectedDepartment(e.target.value)
                }
                label="Отдел"
                sx={{
                  "& .MuiSvgIcon-root": {
                    color: "var(--tg-theme-button-color)",
                  },
                  "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "var(--tg-theme-button-color)",
                    },
                  "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "var(--tg-theme-button-color)",
                    },
                  "&>label": {
                    color: "var(--tg-theme-button-color) !important",
                  },
                  "& label.Mui-focused": {
                    color: "white",
                  },
                }}
                style={{
                  backgroundColor: "var(--tg-theme-secondary-bg-color)",
                  color: "var(--tg-theme-text-color)",
                }}
              >
                {departments.map((dep) => (
                  <MenuItem value={dep.name} key={dep}>
                    {dep.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Опишите цель"
              multiline
              rows={4}
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              fullWidth
              sx={{
                "& label.Mui-focused": {
                  color: "white",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "yellow",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--tg-theme-button-color)",
                  },
                },
              }}
              inputProps={{ style: { color: "var(--tg-theme-text-color)" } }}
              style={{
                backgroundColor: "var(--tg-theme-secondary-bg-color)",
                color: "var(--tg-theme-text-color)",
              }}
            />

            <Button
              variant="contained"
              onClick={handleSubmitGoal}
              disabled={loading || !goalText || !selectedDepartment}
              style={{
                backgroundColor:
                  !goalText || !selectedDepartment
                    ? ""
                    : "var(--tg-theme-button-color)",
                color:
                  !goalText || !selectedDepartment
                    ? ""
                    : "var(--tg-theme-text-color)",
              }}
            >
              {loading ? <CircularProgress size={22} /> : "Сформировать задачи"}
            </Button>
            <Typography
              sx={{
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
                color: "var(--tg-theme-text-color)",
                backgroundColor: "var(--tg-theme-secondary-bg-color)",
                padding: "10px",
                borderRadius: "6px",
              }}
            >
              <section>
                <p>
                  Инструмент для руководителей и менеджеров, который помогает
                  превратить общую цель в конкретный план действий. Быстро,
                  структурно, без лишней ручной работы.
                </p>
              </section>

              <section>
                <h3>1. Как правильно работать</h3>
                <ul>
                  <li>
                    <strong>Сформулируйте цель</strong> — кратко, в 2–3
                    предложениях;
                  </li>
                  <li>
                    <strong>Укажите отдел</strong> — например, IT, Маркетинг,
                    Продажи или "общий" для всей компании;
                  </li>
                  <li>
                    <strong>Получите список задач</strong> — с описанием,
                    сроками и приоритетами;
                  </li>
                  <li>
                    <strong>Назначьте исполнителей</strong> под ваши внутренние
                    процессы.
                  </li>
                </ul>
              </section>

              <section>
                <h3>2. Особенности и советы</h3>
                <ul>
                  <li>
                    Задачи генерируются для каждого отдела, если цель общая;
                  </li>
                  <li>Все задачи автономны — без цепочек зависимостей;</li>
                  <li>
                    Формулировки адаптированы под стиль и язык конкретного
                    отдела;
                  </li>
                  <li>
                    Сроки ориентированы на реальные спринты: 3–10 рабочих дней
                    на задачу;
                  </li>
                  <li>
                    Используется для стратегического планирования, запуска
                    инициатив и синхронизации команд.
                  </li>
                </ul>
              </section>
            </Typography>
          </Stack>
        </>
      ) : (
        <>
          <Typography variant="h5" mb={2}>
            Сформированные задачи
          </Typography>
          <Stack spacing={2}>
            {tasks.map((task, idx) => (
              <Box
                key={idx}
                p={2}
                border="1px solid #ccc"
                borderRadius={2}
                sx={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography fontWeight={600} sx={{ fontSize: "1.1rem" }}>
                    {task.title}
                  </Typography>
                  <IconButton
                    onClick={() => handleDeleteTask(idx)}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {task.description}
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {task.priority}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "error.main" }}>
                    {task.deadline}
                  </Typography>
                </Stack>
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel sx={{ mb: 1 }}>Исполнитель</InputLabel>
                  <Select
                    value={task.worker_id}
                    onChange={(e) => handleWorkerChange(idx, e.target.value)}
                    label="Исполнитель"
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="" disabled>
                      Выберите
                    </MenuItem>
                    {workers.map((w) => (
                      <MenuItem value={w.id} key={w.id}>
                        {w.name ? w.name : `@${w.username}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ))}
          </Stack>

          <Stack direction="row" spacing={2} mt={3}>
            <Button variant="outlined" onClick={resetAll}>
              Начать заново
            </Button>
            <Button variant="contained" onClick={handleApprove}>
              Согласовать
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default OrgChatPage;
