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
              <InputLabel>Отдел</InputLabel>
              <Select
                value={selectedDepartment}
                onChange={(e: SelectChangeEvent) =>
                  setSelectedDepartment(e.target.value)
                }
                label="Отдел"
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
            />

            <Button
              variant="contained"
              onClick={handleSubmitGoal}
              disabled={loading || !goalText || !selectedDepartment}
            >
              {loading ? <CircularProgress size={22} /> : "Сформировать задачи"}
            </Button>
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
