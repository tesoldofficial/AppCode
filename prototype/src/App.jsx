import { startTransition, useEffect, useLayoutEffect, useRef, useState } from "react";

const MINUTE = 60 * 1000;
const MAX_THREAD_TITLE_LENGTH = 48;
const USER_MESSAGE_MAX_WIDTH_RATIO = 2 / 3;
const USER_MESSAGE_WIDTH_GUARD = 6;
const runtimeNow = Date.now();
const runtimeMinute = Math.floor(runtimeNow / MINUTE) * MINUTE;

const NodeType = Object.freeze({
  PROJECT: "project",
  CHAT: "chat",
});

const ChatStatus = Object.freeze({
  IN_PROGRESS: "orange",
  DONE: "green",
});

function minutesAgo(minutes) {
  return runtimeNow - minutes * MINUTE;
}

const projectGroups = [
  {
    id: "root-codex",
    kind: NodeType.PROJECT,
    title: "codex-agent",
    path: "~/code/codex-agent",
    expanded: true,
    items: [
      {
        id: "folder-backend",
        kind: NodeType.PROJECT,
        title: "Backend разработка",
        path: "backend-development",
        expanded: true,
        items: [
          {
            id: "thread-proxy",
            kind: NodeType.CHAT,
            title: "Реализация proxy системы",
            date: minutesAgo(2),
            status: ChatStatus.IN_PROGRESS,
            messages: [
              {
                id: "thread-proxy-user-1",
                role: "user",
                content: "Создай дизайн приложения-агента похожий на Codex App с синими акцентами",
                createdAt: minutesAgo(30),
              },
              {
                id: "thread-proxy-assistant-1",
                role: "assistant",
                content: [
                  "Создаю современный дизайн приложения-агента с темной темой и синими акцентами. Основные компоненты:",
                  "Левая боковая панель для проектов и чатов",
                  "Центральная область для диалогов",
                  "Композер для ввода сообщений",
                  "Темная цветовая схема с синими акцентами (#3b82f6)",
                ],
                createdAt: minutesAgo(29),
              },
              {
                id: "thread-proxy-user-2",
                role: "user",
                content: "Сделай input более smooth и перенеси runtime-контролы внутрь нижней панели.",
                createdAt: minutesAgo(27),
              },
              {
                id: "thread-proxy-assistant-2",
                role: "assistant",
                content: [
                  "Нижнюю панель перестраиваю в духе desktop-compose toolbar:",
                  "слева quick actions и режим доступа",
                  "справа модель, effort, context и круглая send-кнопка",
                  "сам инпут делаю мягче и с большим радиусом",
                ],
                createdAt: minutesAgo(26),
              },
              {
                id: "thread-proxy-user-3",
                role: "user",
                content: "Покажи, как чат будет выглядеть в скролле, когда сообщений станет больше.",
                createdAt: minutesAgo(24),
              },
              {
                id: "thread-proxy-assistant-3",
                role: "assistant",
                content: [
                  "Добавляю демонстрационный поток сообщений, чтобы центральная колонка ощущалась как реальная переписка, а не как статичный скрин.",
                  "Скролл остаётся только у chat-area, composer закреплён внизу и всегда доступен.",
                ],
                createdAt: minutesAgo(23),
              },
              {
                id: "thread-proxy-assistant-4",
                role: "assistant",
                content: "Ниже несколько исходящих сообщений разной длины, чтобы проверить ширину bubble, переносы и соседство с аватаром.",
                createdAt: minutesAgo(22),
              },
              {
                id: "thread-proxy-user-4",
                role: "user",
                content: "Ок",
                createdAt: runtimeMinute - 21 * MINUTE + 8 * 1000,
              },
              {
                id: "thread-proxy-user-5",
                role: "user",
                content: "Короткий вопрос без переноса.",
                createdAt: runtimeMinute - 21 * MINUTE + 22 * 1000,
              },
              {
                id: "thread-proxy-user-6",
                role: "user",
                content: "Покажи, как чат будет выглядеть в скролле, когда сообщений станет больше.",
                createdAt: runtimeMinute - 20 * MINUTE + 8 * 1000,
              },
              {
                id: "thread-proxy-user-7",
                role: "user",
                content: "Сравни поведение длинного сообщения с несколькими частями: сначала обычная фраза, потом уточнение в середине и финальный короткий хвост.",
                createdAt: runtimeMinute - 19 * MINUTE + 8 * 1000,
              },
              {
                id: "thread-proxy-user-8",
                role: "user",
                content: "Здесь есть пунктуация, русский текст и English words inside, чтобы проверить ровность строк без ощущения фиксированной ширины.",
                createdAt: runtimeMinute - 19 * MINUTE + 34 * 1000,
              },
              {
                id: "thread-proxy-assistant-5",
                role: "assistant",
                content: "Если bubble выглядит как самостоятельная форма вокруг текста, значит измеритель работает правильно.",
                createdAt: minutesAgo(16),
              },
              {
                id: "thread-proxy-assistant-6",
                role: "assistant",
                content: "Ниже отдельный пример: пользователь пишет несколько сообщений в пределах одной минуты.",
                createdAt: runtimeMinute - 15 * MINUTE + 5 * 1000,
              },
              {
                id: "thread-proxy-user-9",
                role: "user",
                content: "Первое сообщение в пределах одной минуты.",
                createdAt: runtimeMinute - 14 * MINUTE + 6 * 1000,
              },
              {
                id: "thread-proxy-user-10",
                role: "user",
                content: "Сразу дописываю второе, без отдельного времени и кнопок под первым.",
                createdAt: runtimeMinute - 14 * MINUTE + 24 * 1000,
              },
              {
                id: "thread-proxy-user-11",
                role: "user",
                content: "И третье закрывает группу, поэтому время показывается только здесь.",
                createdAt: runtimeMinute - 14 * MINUTE + 42 * 1000,
              },
            ],
          },
          {
            id: "thread-mcp",
            kind: NodeType.CHAT,
            title: "Настройка MCP серверов",
            date: minutesAgo(60),
            status: ChatStatus.DONE,
            messages: [
              {
                id: "thread-mcp-user-1",
                role: "user",
                content: "Собери MCP конфиг для Linear и GitHub, чтобы он был безопасен для прототипа.",
                createdAt: minutesAgo(96),
              },
              {
                id: "thread-mcp-assistant-1",
                role: "assistant",
                content: [
                  "Подготовил безопасный минимальный состав MCP-подключений для демо.",
                  "Linear и GitHub вынесены в отдельные подключения с явными зонами ответственности.",
                  "UI в прототипе может показывать их как разные контексты проекта.",
                ],
                createdAt: minutesAgo(95),
              },
            ],
          },
          {
            id: "folder-auth-gateway",
            kind: NodeType.PROJECT,
            title: "Auth gateway",
            path: "auth-gateway",
            expanded: true,
            items: [
              {
                id: "thread-auth",
                kind: NodeType.CHAT,
                title: "Ротация service token",
                date: minutesAgo(18),
                status: ChatStatus.DONE,
                favorite: true,
                messages: [
                  {
                    id: "thread-auth-user-1",
                    role: "user",
                    content: "Разбей ротацию сервисного токена на безопасные шаги без downtime.",
                    createdAt: minutesAgo(54),
                  },
                  {
                    id: "thread-auth-assistant-1",
                    role: "assistant",
                    content: [
                      "Разложил миграцию на две фазы: выпуск нового секрета и мягкое переключение клиентов.",
                      "Параллельно держим старый токен валидным, пока метрики не покажут полное переключение.",
                    ],
                    createdAt: minutesAgo(53),
                  },
                ],
              },
              {
                id: "folder-release-audit",
                kind: NodeType.PROJECT,
                title: "Release audit",
                path: "release-audit",
                expanded: true,
                items: [
                  {
                    id: "thread-release",
                    kind: NodeType.CHAT,
                    title: "Ревью регресса релиза",
                    date: minutesAgo(42),
                    status: ChatStatus.IN_PROGRESS,
                    messages: [
                      {
                        id: "thread-release-user-1",
                        role: "user",
                        content: "Собери короткий список блокеров перед вечерним релизом.",
                        createdAt: minutesAgo(82),
                      },
                      {
                        id: "thread-release-assistant-1",
                        role: "assistant",
                        content: [
                          "Собрал pre-release список и разбил риски на блокеры и деградации.",
                          "Главный фокус: сеть, миграции конфигурации и откат на stage-stand.",
                        ],
                        createdAt: minutesAgo(80),
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "folder-frontend",
        kind: NodeType.PROJECT,
        title: "Frontend дизайн",
        path: "frontend-design",
        expanded: true,
        items: [],
      },
    ],
  },
];

function materializeProjectGroups(groups) {
  const folders = [];
  const threads = [];
  let defaultThreadId = null;

  const visitProject = (project, parentId, order) => {
    const folderId = project.id;
    const folder = {
      id: folderId,
      kind: parentId ? "folder" : "root",
      name: project.title,
      displayPath: parentId ? null : project.path,
      path: project.path,
      parentId,
      expanded: project.expanded ?? true,
      order,
      source: "demo",
    };

    folders.push(folder);

    (project.items ?? []).forEach((item, index) => {
      if (item.kind === NodeType.PROJECT) {
        visitProject(item, folderId, index);
        return;
      }

      defaultThreadId ??= item.id;
      threads.push({
        id: item.id,
        folderId,
        title: item.title,
        status: item.status,
        favorite: item.favorite ?? false,
        updatedAt: item.date,
        messages: item.messages ?? [],
      });
    });
  };

  groups.forEach((group, index) => visitProject(group, null, index));

  return { folders, threads, defaultThreadId };
}

const initialProjectTree = materializeProjectGroups(projectGroups);
const initialFolders = initialProjectTree.folders;
const initialThreads = initialProjectTree.threads;
const defaultActiveThreadId = initialProjectTree.defaultThreadId;

const initialFolderDrafts = {
  "folder:folder-release-audit": "Собери список рисков перед вечерним релизом и отдельно выдели блокеры.",
};

const initialThreadRenderSurfaces = {
  "thread-proxy": {
    isClosed: false,
    todo: [
      { id: "proxy-todo-1", label: "Вынести render-window над composer", state: "done" },
      { id: "proxy-todo-2", label: "Показать split-режим: todo + agents", state: "active" },
      { id: "proxy-todo-3", label: "Скрывать панель, когда компонентов нет", state: "pending" },
    ],
    agents: [
      {
        id: "proxy-agent-1",
        name: "Planner",
        role: "planner",
        model: "GPT-5.4",
        effort: "xhigh",
        speed: "Fast",
        status: "success",
      },
      {
        id: "proxy-agent-2",
        name: "UI agent",
        role: "designer",
        model: "GPT-5.4-Mini",
        effort: "high",
        speed: "Fast",
        status: "running",
      },
      {
        id: "proxy-agent-3",
        name: "Reviewer",
        role: "reviewer",
        model: "GPT-5.4-Mini",
        effort: "medium",
        speed: "Standart",
        status: "success",
      },
    ],
  },
  "thread-mcp": {
    isClosed: true,
    todo: [],
    agents: [
      {
        id: "mcp-agent-1",
        name: "MCP mapper",
        role: "mapper",
        model: "GPT-5.4",
        effort: "xhigh",
        speed: "Fast",
        status: "success",
      },
      {
        id: "mcp-agent-2",
        name: "Policy agent",
        role: "policy",
        model: "GPT-5.4-Mini",
        effort: "medium",
        speed: "Standart",
        status: "error",
      },
    ],
  },
  "thread-auth": {
    isClosed: false,
    todo: [
      { id: "auth-todo-1", label: "Выпустить новый service token", state: "done" },
      { id: "auth-todo-2", label: "Переключить клиентов без downtime", state: "active" },
      { id: "auth-todo-3", label: "Подтвердить полное переключение по метрикам", state: "pending" },
    ],
    agents: [],
  },
};

const permissionOptions = [
  { id: "default", label: "Default permissions" },
  { id: "full", label: "Full access" },
];

const modelOptions = [
  { id: "gpt-5.4", label: "GPT-5.4" },
  { id: "gpt-5.2-codex", label: "GPT-5.2-Codex" },
  { id: "gpt-5.1-codex-max", label: "GPT-5.1-Codex-Max" },
  { id: "gpt-5.4-mini", label: "GPT-5.4-Mini" },
  { id: "gpt-5.3-codex", label: "GPT-5.3-Codex" },
  { id: "gpt-5.3-codex-spark", label: "GPT-5.3-Codex-Spark" },
  { id: "gpt-5.2", label: "GPT-5.2" },
  { id: "gpt-5.1-codex-mini", label: "GPT-5.1-Codex-Mini" },
];

const reasoningOptions = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
  { id: "extra-high", label: "Extra High" },
];

const continueOptions = [
  { id: "local", label: "Work locally", disabled: false },
  { id: "web", label: "Connect Codex web", disabled: false },
  { id: "cloud", label: "Send to cloud", disabled: true },
];

const branchOptions = [
  {
    id: "prototype-sidebar-polish",
    label: "prototype/sidebar-polish",
    description: "Файлов с незафиксированными изменениями: 5",
  },
  {
    id: "main",
    label: "main",
    description: "Чистая ветка, готова к синхронизации",
  },
];

const themeOptions = [
  {
    id: "grey",
    label: "Grey",
    description: "Холодная графитовая палитра с нейтральными поверхностями.",
    swatches: ["#202023", "#3a3a3c", "#6f6f73"],
  },
  {
    id: "sand",
    label: "Sand",
    description: "Серо-бежевый акцент для bubble и composer, ближе к desktop Codex.",
    swatches: ["#231f1b", "#c6b7a6", "#8d7b6b"],
  },
];

const chatSurfaceOptions = [
  {
    id: "inside",
    label: "Inside",
    description: "Панель утоплена в общее полотно.",
  },
  {
    id: "outside",
    label: "Outside",
    description: "Панель лежит поверх полотна отдельным слоем.",
  },
];

let runtimeId = 0;

function makeId(prefix) {
  runtimeId += 1;
  return `${prefix}-${runtimeId}`;
}

function formatRelativeTime(timestamp) {
  const delta = Math.max(Date.now() - timestamp, 0);
  const minutes = Math.floor(delta / MINUTE);

  if (minutes < 1) {
    return "сейчас";
  }

  if (minutes < 60) {
    return `${minutes}м назад`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}ч назад`;
  }

  const days = Math.floor(hours / 24);
  return `${days}д назад`;
}

function formatChatTime(timestamp) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

function getSelectedLabel(options, selectedId) {
  return options.find((option) => option.id === selectedId)?.label ?? "";
}

function trimThreadTitle(input) {
  const normalized = input.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "Новый чат";
  }

  return normalized.length > MAX_THREAD_TITLE_LENGTH
    ? `${normalized.slice(0, MAX_THREAD_TITLE_LENGTH - 1)}…`
    : normalized;
}

function createUserMessage(text) {
  return {
    id: makeId("message"),
    role: "user",
    content: text,
    createdAt: Date.now(),
  };
}

function createAssistantMessage(text, folderName, isNewThread = false) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const preview = normalized.length > 84 ? `${normalized.slice(0, 83)}…` : normalized;

  return {
    id: makeId("message"),
    role: "assistant",
    content: isNewThread
      ? [
          `Создал новый чат в папке «${folderName}» и зафиксировал первую постановку.`,
          `Стартовый запрос: ${preview}`,
          "Дальше можно уточнять детали прямо в этом треде, а дерево слева уже отражает новый контекст.",
        ]
      : [
          `Принял обновление для папки «${folderName}».`,
          `Последний запрос: ${preview}`,
          "Продолжаю обсуждение в этом треде и держу контекст в рамках выбранной папки.",
        ],
    createdAt: Date.now() + 1000,
  };
}

function normalizeRenderSurface(surface) {
  if (!surface) {
    return null;
  }

  const todo = Array.isArray(surface.todo) ? surface.todo : [];
  const agents = Array.isArray(surface.agents) ? surface.agents : [];
  const isClosed = Boolean(surface.isClosed);

  if (todo.length === 0 && agents.length === 0) {
    return null;
  }

  if (surface.todo === todo && surface.agents === agents && surface.isClosed === isClosed) {
    return surface;
  }

  return { isClosed, todo, agents };
}

function buildThreadRenderSurface(text, folderName, fallbackSurface = null) {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return normalizeRenderSurface(fallbackSurface);
  }

  const wantsTodo = /(todo|туду|задач|чек-?лист|checklist)/i.test(normalized);
  const wantsAgents = /(agents?|агент|оркестр|executor|исполнител)/i.test(normalized);

  if (!wantsTodo && !wantsAgents) {
    return normalizeRenderSurface(fallbackSurface);
  }

  const preview = normalized.length > 62 ? `${normalized.slice(0, 61)}…` : normalized;

  return normalizeRenderSurface({
    isClosed: false,
    todo: wantsTodo
      ? [
          {
            id: `${folderName}-todo-1`,
            label: `Собрать todo-поток для «${folderName}»`,
            state: "done",
          },
          {
            id: `${folderName}-todo-2`,
            label: `Разбить запрос на шаги: ${preview}`,
            state: "active",
          },
          {
            id: `${folderName}-todo-3`,
            label: "Подготовить итоговый список действий для композера",
            state: "pending",
          },
        ]
      : [],
    agents: wantsAgents
      ? [
          {
            id: `${folderName}-agent-1`,
            name: "Planner",
            role: "planner",
            model: "GPT-5.4",
            effort: "xhigh",
            speed: "Fast",
            status: "success",
          },
          {
            id: `${folderName}-agent-2`,
            name: "Execution",
            role: "designer",
            model: "GPT-5.4-Mini",
            effort: "high",
            speed: "Fast",
            status: "running",
          },
          {
            id: `${folderName}-agent-3`,
            name: "Reviewer",
            role: "reviewer",
            model: "GPT-5.4-Mini",
            effort: "medium",
            speed: "Standart",
            status: wantsTodo ? "success" : "error",
          },
        ]
      : [],
  });
}

function sortThreadsForFolder(threads, folderId) {
  return threads
    .filter((thread) => thread.folderId === folderId)
    .sort((left, right) => right.updatedAt - left.updatedAt);
}

function sortFoldersForParent(folders, parentId) {
  return folders
    .filter((folder) => folder.parentId === parentId)
    .sort((left, right) => left.order - right.order);
}

function getFolderChildEntries(folderId, folders, threads) {
  const threadEntries = sortThreadsForFolder(threads, folderId).map((thread) => ({
    key: `thread:${thread.id}`,
    kind: "thread",
    thread,
  }));
  const folderEntries = sortFoldersForParent(folders, folderId).map((folder) => ({
    key: `folder:${folder.id}`,
    kind: "folder",
    folder,
  }));

  return [...threadEntries, ...folderEntries];
}

function countDirectThreads(folderId, threads) {
  return threads.filter((thread) => thread.folderId === folderId).length;
}

function countVisibleItemsInFolderTree(folderId, folders, threads) {
  const childFolders = sortFoldersForParent(folders, folderId);
  const directThreadsCount = countDirectThreads(folderId, threads);

  return childFolders.reduce((total, childFolder) => {
    const childEntries = getFolderChildEntries(childFolder.id, folders, threads);

    if (childEntries.length === 0) {
      return total + 1;
    }

    return total + countVisibleItemsInFolderTree(childFolder.id, folders, threads);
  }, directThreadsCount);
}

function expandFolderLineage(folders, folderId) {
  const expandedIds = new Set();
  const folderById = new Map(folders.map((folder) => [folder.id, folder]));
  let currentId = folderId;

  while (currentId) {
    expandedIds.add(currentId);
    currentId = folderById.get(currentId)?.parentId ?? null;
  }

  return folders.map((folder) =>
    expandedIds.has(folder.id) && !folder.expanded ? { ...folder, expanded: true } : folder,
  );
}

function getNextFolderOrder(folders, parentId) {
  return (
    folders
      .filter((folder) => folder.parentId === parentId)
      .reduce((maxOrder, folder) => Math.max(maxOrder, folder.order), -1) + 1
  );
}

function getFolderTargetKey(folderId) {
  return `folder:${folderId}`;
}

function getFolderById(folders, folderId) {
  return folders.find((folder) => folder.id === folderId) ?? null;
}

function getThreadById(threads, threadId) {
  return threads.find((thread) => thread.id === threadId) ?? null;
}

function getFolderTrail(folderId, folders) {
  const folderById = new Map(folders.map((folder) => [folder.id, folder]));
  const trail = [];
  let currentId = folderId;

  while (currentId) {
    const folder = folderById.get(currentId);

    if (!folder) {
      break;
    }

    trail.push(folder.name);
    currentId = folder.parentId;
  }

  return trail.reverse();
}

function getTopLevelVisibleFolderId(rootFolderId, folders, threads) {
  let currentFolderId = rootFolderId;

  while (true) {
    const childFolders = sortFoldersForParent(folders, currentFolderId);
    const hasDirectThreads = countDirectThreads(currentFolderId, threads) > 0;

    if (hasDirectThreads || childFolders.length !== 1) {
      return currentFolderId;
    }

    currentFolderId = childFolders[0].id;
  }
}

function buildFolderDisplayPath(folderId, folders) {
  const folderById = new Map(folders.map((folder) => [folder.id, folder]));
  const trail = [];
  let currentFolderId = folderId;
  let rootDisplayPath = null;

  while (currentFolderId) {
    const folder = folderById.get(currentFolderId);

    if (!folder) {
      break;
    }

    if (folder.kind === "root") {
      rootDisplayPath = folder.displayPath ?? "Folder via Files";
      break;
    }

    trail.push(folder.name);
    currentFolderId = folder.parentId;
  }

  if (!rootDisplayPath) {
    return "Folder via Files";
  }

  if (trail.length === 0) {
    return rootDisplayPath;
  }

  return `${rootDisplayPath}/${trail.reverse().join("/")}`;
}

function buildVisibleRootEntries(folders, threads) {
  return sortFoldersForParent(folders, null).map((rootFolder) => {
    const visibleFolderId = getTopLevelVisibleFolderId(rootFolder.id, folders, threads);
    const visibleFolder = getFolderById(folders, visibleFolderId) ?? rootFolder;

    return {
      key: `root:${rootFolder.id}`,
      folder: visibleFolder,
      displayPath: buildFolderDisplayPath(visibleFolder.id, folders),
      totalThreads: countVisibleItemsInFolderTree(visibleFolder.id, folders, threads),
    };
  });
}

function getDraftTarget(targetKey, folders, pendingFolderTargets) {
  if (targetKey.startsWith("folder:")) {
    const folderId = targetKey.slice("folder:".length);
    const folder = getFolderById(folders, folderId);

    if (!folder) {
      return null;
    }

    return {
      key: targetKey,
      kind: "folder",
      folderId,
      folder,
      label: folder.name,
    };
  }

  return pendingFolderTargets.find((target) => target.key === targetKey) ?? null;
}

async function findFolderByHandle(handle, folders) {
  for (const folder of folders) {
    if (!folder.handle) {
      continue;
    }

    if (await folder.handle.isSameEntry(handle)) {
      return folder;
    }
  }

  return null;
}

async function findPendingTargetByHandle(handle, pendingTargets) {
  for (const target of pendingTargets) {
    if (await target.handle.isSameEntry(handle)) {
      return target;
    }
  }

  return null;
}

async function findClosestVisibleHandleAncestor(handle, folders) {
  let closestFolder = null;
  let closestDepth = Number.POSITIVE_INFINITY;

  for (const folder of folders) {
    if (!folder.handle) {
      continue;
    }

    const relativePath = await folder.handle.resolve(handle);

    if (Array.isArray(relativePath) && relativePath.length > 0 && relativePath.length < closestDepth) {
      closestFolder = folder;
      closestDepth = relativePath.length;
    }
  }

  return closestFolder;
}

async function normalizeHandleFolderHierarchy(folders) {
  const normalizedFolders = [...folders];
  const folderById = new Map(normalizedFolders.map((folder) => [folder.id, folder]));

  for (const folder of normalizedFolders) {
    if (!folder.handle) {
      continue;
    }

    let closestAncestor = null;
    let closestDepth = Number.POSITIVE_INFINITY;

    for (const candidate of normalizedFolders) {
      if (candidate.id === folder.id || !candidate.handle) {
        continue;
      }

      const relativePath = await candidate.handle.resolve(folder.handle);

      if (Array.isArray(relativePath) && relativePath.length > 0 && relativePath.length < closestDepth) {
        closestAncestor = candidate;
        closestDepth = relativePath.length;
      }
    }

    const currentFolder = folderById.get(folder.id);
    const nextParentId = closestAncestor?.id ?? null;
    const nextKind = nextParentId ? "folder" : "root";

    if (currentFolder.parentId !== nextParentId || currentFolder.kind !== nextKind) {
      const nextFolder = {
        ...currentFolder,
        parentId: nextParentId,
        kind: nextKind,
      };

      folderById.set(folder.id, nextFolder);
    }
  }

  return normalizedFolders.map((folder) => folderById.get(folder.id) ?? folder);
}

function getKeyActionHandler(action) {
  return (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M11.5 11.5L14 14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
      <circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M6 8.7 9.9 4.8a2.1 2.1 0 1 1 3 3L7.4 13.3a3.4 3.4 0 0 1-4.8-4.8L8 3.1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2.8 4.3h3.1M8.6 4.3h4.6M2.8 8h6.1M11.6 8h1.6M2.8 11.7h1.7M7.2 11.7h6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
      <circle cx="7.2" cy="4.3" r="1.25" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="10.2" cy="8" r="1.25" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="5.8" cy="11.7" r="1.25" fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M7 1.5 8 4.6l3.1 1L8 6.6 7 9.7 6 6.6 2.9 5.6 6 4.6 7 1.5Zm4.4 6.2.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.15"
      />
    </svg>
  );
}

function HandIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M5.1 7.1V3.8a.9.9 0 1 1 1.8 0v2M6.9 5.7V2.9a.9.9 0 1 1 1.8 0v2.8M8.7 5.7V3.5a.9.9 0 1 1 1.8 0v3M10.5 6.5V4.8a.9.9 0 1 1 1.8 0V8c0 2.7-1.8 4.4-4.4 4.4-2.4 0-4.1-1.6-4.1-4V7.2a.9.9 0 1 1 1.8 0v1.7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.15"
      />
    </svg>
  );
}

function LaptopIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.2 4.2h9.6c.4 0 .7.3.7.7v5.2H2.5V4.9c0-.4.3-.7.7-.7ZM1.8 11.3h12.4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.15"
      />
    </svg>
  );
}

function ClockLinkIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 4.2v3l2 1.2M11.9 11.9l2.1-2.1M12.5 7.8A4.7 4.7 0 1 1 8 3.3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.15"
      />
    </svg>
  );
}

function CloudOffIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M5.2 12.4H11a2.4 2.4 0 0 0 .3-4.8 3.7 3.7 0 0 0-7-1.1A2.5 2.5 0 0 0 5.2 12.4Zm-2.7-9 11 11"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.15"
      />
    </svg>
  );
}

function PinIcon({ filled = false }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="m9.8 2.5 3.7 3.7-2.2.8-1.9 3.3.8.8-1.1 1.1-2.2-2.2-3.2 3.2-.9-.9L6 9.1 3.8 6.9l1.1-1.1.8.8L9 4.7l.8-2.2Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={filled ? "1.55" : "1.25"}
      />
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M9.3 3.4h3.3v3.3M8.8 7.2l3.8-3.8M10.8 8.6v3H3.6V4.4h3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.15"
      />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3 4h4M9 4h4M5 4a1.4 1.4 0 1 1-2.8 0A1.4 1.4 0 0 1 5 4Zm8 8H9M7 12H3m5.8 0a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true">
      <path d="M7 2v10M2 7h10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.35" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m4 10 4-4 4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.4 3.2h9.2c.8 0 1.4.6 1.4 1.4v5.4c0 .8-.6 1.4-1.4 1.4H7l-2.6 2v-2H3.4c-.8 0-1.4-.6-1.4-1.4V4.6c0-.8.6-1.4 1.4-1.4Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect
        x="5.2"
        y="3.2"
        width="7.6"
        height="9"
        rx="1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path
        d="M10.1 12.8H4.8a1.6 1.6 0 0 1-1.6-1.6V5.9"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.15"
      />
    </svg>
  );
}

function BranchIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="4.2" cy="3.5" r="1.4" fill="none" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="11.8" cy="5.7" r="1.4" fill="none" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="4.2" cy="12.2" r="1.4" fill="none" stroke="currentColor" strokeWidth="1.15" />
      <path
        d="M5.6 3.5h2a2.8 2.8 0 0 1 2.8 2.8v0M4.2 4.9v4.6a2.7 2.7 0 0 0 2.7 2.7h1.9"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.15"
      />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 13V3m0 0L4.7 6.3M8 3l3.3 3.3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="m3.8 8.3 2.6 2.6 5.8-5.8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="m4 4 8 8M12 4l-8 8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function WindowMinimizeIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M4 10.5h8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function WindowMaximizeIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M5 5h6v6H5z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function ToggleSwitch({ checked }) {
  return (
    <span className={checked ? "toggle-switch toggle-switch--checked" : "toggle-switch"} aria-hidden="true">
      <span className="toggle-switch__thumb" />
    </span>
  );
}

function ComposerMenu({ title, options, selectedId, onSelect, className = "", showIcons = false }) {
  return (
    <div className={`composer-menu ${className}`.trim()}>
      {title ? <div className="composer-menu__title">{title}</div> : null}

      <div className="composer-menu__options">
        {options.map((option) => {
          const isSelected = option.id === selectedId;

          return (
            <button
              key={option.id}
              className={isSelected ? "composer-menu__option composer-menu__option--selected" : "composer-menu__option"}
              type="button"
              onClick={() => onSelect(option.id)}
            >
              <span className="composer-menu__option-main">
                {showIcons ? (
                  <span className="composer-menu__option-icon">
                    <HandIcon />
                  </span>
                ) : null}
                <span>{option.label}</span>
              </span>

              <span className="composer-menu__option-mark">
                {isSelected ? <CheckIcon /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BranchMenu({ selectedBranchId, onSelectBranch }) {
  return (
    <div className="branch-menu composer-menu composer-menu--left">
      <label className="branch-menu__search">
        <span className="branch-menu__search-icon">
          <SearchIcon />
        </span>
        <span>Поиск ветвей</span>
      </label>

      <div className="branch-menu__section-label">Ветки</div>

      <div className="branch-menu__options">
        {branchOptions.map((branch) => {
          const isSelected = branch.id === selectedBranchId;

          return (
            <button
              key={branch.id}
              className={isSelected ? "branch-menu__option branch-menu__option--selected" : "branch-menu__option"}
              type="button"
              onClick={() => onSelectBranch(branch.id)}
            >
              <span className="branch-menu__option-icon">
                <BranchIcon />
              </span>
              <span className="branch-menu__option-copy">
                <span className="branch-menu__option-title">{branch.label}</span>
                <span className="branch-menu__option-description">{branch.description}</span>
              </span>
              <span className="branch-menu__option-mark">{isSelected ? <CheckIcon /> : null}</span>
            </button>
          );
        })}
      </div>

      <div className="branch-menu__divider" />

      <button className="branch-menu__create" type="button">
        <span className="branch-menu__create-icon">
          <PlusIcon />
        </span>
        <span>Создать и переключиться на новую ветку...</span>
      </button>
    </div>
  );
}

function QuickActionsMenu({
  includeIdeContext,
  planMode,
  selectedContinueMode,
  onToggleIdeContext,
  onTogglePlanMode,
  onSelectContinueMode,
}) {
  return (
    <div className="composer-menu composer-menu--quick composer-menu--left">
      <button className="composer-action-row" type="button">
        <span className="composer-action-row__main">
          <span className="composer-action-row__icon">
            <PaperclipIcon />
          </span>
          <span>Add photos & files</span>
        </span>
      </button>

      <div className="composer-action-divider" />

      <button className="composer-action-row" type="button" onClick={onToggleIdeContext}>
        <span className="composer-action-row__main">
          <span className="composer-action-row__icon">
            <SparklesIcon />
          </span>
          <span>Include IDE context</span>
        </span>
        <ToggleSwitch checked={includeIdeContext} />
      </button>

      <button className="composer-action-row" type="button" onClick={onTogglePlanMode}>
        <span className="composer-action-row__main">
          <span className="composer-action-row__icon">
            <SlidersIcon />
          </span>
          <span>Plan mode</span>
        </span>
        <ToggleSwitch checked={planMode} />
      </button>

      <div className="composer-action-divider" />

      <div className="composer-menu__title composer-menu__title--muted composer-menu__title--section">
        Continue in
      </div>

      <div className="composer-menu__options">
        {continueOptions.map((option) => {
          const isSelected = option.id === selectedContinueMode;
          const optionClassName = option.disabled
            ? "composer-menu__option composer-menu__option--disabled"
            : isSelected
              ? "composer-menu__option composer-menu__option--selected"
              : "composer-menu__option";

          let icon = <LaptopIcon />;

          if (option.id === "web") {
            icon = <ClockLinkIcon />;
          }

          if (option.id === "cloud") {
            icon = <CloudOffIcon />;
          }

          return (
            <button
              key={option.id}
              className={optionClassName}
              type="button"
              disabled={option.disabled}
              onClick={() => onSelectContinueMode(option.id)}
            >
              <span className="composer-menu__option-main">
                <span className="composer-menu__option-icon">{icon}</span>
                <span>{option.label}</span>
              </span>

              <span className="composer-menu__option-mark">
                {isSelected ? <CheckIcon /> : option.id === "web" ? <ExternalArrowIcon /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SidebarTree({
  rootEntries,
  folders,
  threads,
  activeThreadId,
  onToggleExpanded,
  onOpenDraft,
  onSelectThread,
  onToggleFavorite,
  onToggleProjectFavorite,
}) {
  return (
    <div className="sidebar-tree">
      {rootEntries.map((entry, index) => (
        <NodeFrame
          key={entry.key}
          entry={entry}
          nodeKey={entry.folder.path}
          depth={0}
          isLast={index === rootEntries.length - 1}
          folders={folders}
          threads={threads}
          activeThreadId={activeThreadId}
          onToggleExpanded={onToggleExpanded}
          onOpenDraft={onOpenDraft}
          onSelectThread={onSelectThread}
          onToggleFavorite={onToggleFavorite}
          onToggleProjectFavorite={onToggleProjectFavorite}
        />
      ))}
    </div>
  );
}

function NodeFrame({
  entry,
  nodeKey,
  depth,
  isLast,
  folders,
  threads,
  activeThreadId,
  onToggleExpanded,
  onOpenDraft,
  onSelectThread,
  onToggleFavorite,
  onToggleProjectFavorite,
}) {
  if (entry.kind === "thread") {
    return (
      <ChatFrame
        thread={entry.thread}
        nodeKey={nodeKey}
        isActive={entry.thread.id === activeThreadId}
        isLast={isLast}
        onSelectThread={onSelectThread}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  return (
    <ProjectFrame
      entry={entry}
      nodeKey={nodeKey}
      depth={depth}
      isLast={isLast}
      folders={folders}
      threads={threads}
      activeThreadId={activeThreadId}
      onToggleExpanded={onToggleExpanded}
      onOpenDraft={onOpenDraft}
      onSelectThread={onSelectThread}
      onToggleFavorite={onToggleFavorite}
      onToggleProjectFavorite={onToggleProjectFavorite}
    />
  );
}

function ProjectFrame({
  entry,
  nodeKey,
  depth,
  isLast,
  folders,
  threads,
  activeThreadId,
  onToggleExpanded,
  onOpenDraft,
  onSelectThread,
  onToggleFavorite,
  onToggleProjectFavorite,
}) {
  const { folder } = entry;
  const isRoot = depth === 0;
  const childEntries = getFolderChildEntries(folder.id, folders, threads);
  const hasChildren = childEntries.length > 0;
  const isCollapsed = hasChildren && !folder.expanded;
  const displayPath = isRoot ? entry.displayPath : null;
  const visibleCount = isRoot ? entry.totalThreads : undefined;

  return (
    <section
      className={`tree-node project-node ${hasChildren ? "" : "is-empty"} ${
        isCollapsed ? "is-collapsed" : ""
      } depth-${depth} ${isRoot ? "is-root" : ""} ${isLast ? "is-last-child" : ""}`}
    >
      <NodeRail
        nodeKind={NodeType.PROJECT}
        title={folder.name}
        isCollapsed={isCollapsed}
        onToggle={() => onToggleExpanded(folder.id)}
      />
      <ProjectContent
        folder={folder}
        nodeKey={nodeKey}
        displayPath={displayPath}
        visibleCount={visibleCount}
        childEntries={childEntries}
        isRoot={isRoot}
        isCollapsed={isCollapsed}
        hasChildren={hasChildren}
        depth={depth}
        folders={folders}
        threads={threads}
        activeThreadId={activeThreadId}
        onToggleExpanded={onToggleExpanded}
        onOpenDraft={onOpenDraft}
        onSelectThread={onSelectThread}
        onToggleFavorite={onToggleFavorite}
        onToggleProjectFavorite={onToggleProjectFavorite}
      />
    </section>
  );
}

function ProjectContent({
  folder,
  nodeKey,
  displayPath,
  visibleCount,
  childEntries,
  isRoot,
  isCollapsed,
  hasChildren,
  depth,
  folders,
  threads,
  activeThreadId,
  onToggleExpanded,
  onOpenDraft,
  onSelectThread,
  onToggleFavorite,
  onToggleProjectFavorite,
}) {
  return (
    <div className="node-body">
      <ProjectHeader
        folder={folder}
        displayPath={displayPath}
        isRoot={isRoot}
        visibleCount={visibleCount}
        onToggleProjectFavorite={onToggleProjectFavorite}
      />
      {hasChildren && !isCollapsed ? (
        <ProjectChildren
          entries={childEntries}
          parentKey={nodeKey}
          depth={depth}
          isRoot={isRoot}
          folders={folders}
          threads={threads}
          activeThreadId={activeThreadId}
          onToggleExpanded={onToggleExpanded}
          onOpenDraft={onOpenDraft}
          onSelectThread={onSelectThread}
          onToggleFavorite={onToggleFavorite}
          onToggleProjectFavorite={onToggleProjectFavorite}
        />
      ) : null}
    </div>
  );
}

function ProjectHeader({ folder, displayPath, isRoot, visibleCount, onToggleProjectFavorite }) {
  return (
    <div className={`project-heading ${isRoot ? "project-heading--root" : "project-heading--folder"}`}>
      <div className="project-copy">
        <h1>{folder.name}</h1>
        {displayPath ? <p>{displayPath}</p> : null}
      </div>
      <div className="project-heading__actions">
        {visibleCount === undefined ? null : <span className="counter">{visibleCount}</span>}
        <button
          className={`pin project-pin ${folder.favorite ? "filled" : ""}`}
          type="button"
          aria-label={folder.favorite ? "Убрать проект из избранного" : "Добавить проект в избранное"}
          aria-pressed={Boolean(folder.favorite)}
          onClick={(event) => {
            event.stopPropagation();
            onToggleProjectFavorite(folder.id);
          }}
        >
          <PinIcon filled={folder.favorite} />
        </button>
      </div>
    </div>
  );
}

function ProjectChildren({
  entries,
  parentKey,
  depth,
  isRoot,
  folders,
  threads,
  activeThreadId,
  onToggleExpanded,
  onOpenDraft,
  onSelectThread,
  onToggleFavorite,
  onToggleProjectFavorite,
}) {
  return (
    <nav className="node-children" aria-label={isRoot ? "Список задач codex-agent" : undefined}>
      {entries.map((entry, index) => {
        const childKey = getTreeNodeKey(parentKey, entry);

        return (
          <NodeFrame
            key={entry.key}
            entry={entry}
            nodeKey={childKey}
            depth={depth + 1}
            isLast={index === entries.length - 1}
            folders={folders}
            threads={threads}
            activeThreadId={activeThreadId}
            onToggleExpanded={onToggleExpanded}
            onOpenDraft={onOpenDraft}
            onSelectThread={onSelectThread}
            onToggleFavorite={onToggleFavorite}
            onToggleProjectFavorite={onToggleProjectFavorite}
          />
        );
      })}
    </nav>
  );
}

function ChatFrame({ thread, nodeKey, isActive, isLast, onSelectThread, onToggleFavorite }) {
  return (
    <article className={`tree-node chat-node ${isActive ? "is-active" : ""} ${isLast ? "is-last-child" : ""}`}>
      <NodeRail nodeKind={NodeType.CHAT} title={thread.title} />
      <div className="node-body">
        <div
          className="chat-card"
          role="button"
          tabIndex={0}
          onClick={() => onSelectThread(thread.id)}
          onKeyDown={getKeyActionHandler(() => onSelectThread(thread.id))}
        >
          <div className="chat-content">
            <h2>{thread.title}</h2>
            <p>
              <time dateTime={new Date(thread.updatedAt).toISOString()}>{formatRelativeTime(thread.updatedAt)}</time>
              <span className={`status-dot ${thread.status}`} aria-hidden="true" />
            </p>
          </div>

          <button
            className={`pin ${thread.favorite ? "filled" : ""}`}
            type="button"
            aria-label={thread.favorite ? "Убрать из избранного" : "Добавить в избранное"}
            aria-pressed={thread.favorite}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(thread.id);
            }}
          >
            <PinIcon filled={thread.favorite} />
          </button>
        </div>
      </div>
    </article>
  );
}

function NodeRail({ nodeKind, title, isCollapsed = false, onToggle }) {
  if (nodeKind === NodeType.CHAT) {
    return (
      <div className="node-rail" aria-hidden="true">
        <span className="rail-line" />
        <span className="node-marker chat-marker" aria-hidden="true">
          <MessageIcon />
        </span>
      </div>
    );
  }

  return (
    <div className="node-rail">
      <span className="rail-line" aria-hidden="true" />
      <button
        className="node-marker project-toggle"
        type="button"
        aria-label={isCollapsed ? `Развернуть ${title}` : `Свернуть ${title}`}
        aria-expanded={!isCollapsed}
        onClick={onToggle}
      >
        <span className="project-marker">{isCollapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}</span>
      </button>
    </div>
  );
}

function getTreeNodeKey(parentKey, entry) {
  const segment = entry.kind === "folder" ? entry.folder.path : entry.thread.title;

  return `${parentKey}/${segment}`;
}

function getMessageMinuteKey(message) {
  return Math.floor(message.createdAt / MINUTE);
}

function isSameMinuteUserMessage(message, comparisonMessage) {
  return (
    message?.role === "user" &&
    comparisonMessage?.role === "user" &&
    getMessageMinuteKey(message) === getMessageMinuteKey(comparisonMessage)
  );
}

function MessageMeta({ time, align = "left", showCopy = true, showBranch = true }) {
  const hasActions = showCopy || showBranch;

  return (
    <div className={align === "right" ? "message-meta message-meta--right" : "message-meta"}>
      <span className={align === "right" ? "message-time message-time--right" : "message-time"}>
        {time}
        {hasActions ? (
          <span className="message-actions" aria-hidden="true">
            {showCopy ? (
              <button className="message-action-button" type="button" aria-label="Копировать">
                <CopyIcon />
              </button>
            ) : null}
            {showBranch ? (
              <button className="message-action-button" type="button" aria-label="Ответвить">
                <BranchIcon />
              </button>
            ) : null}
          </span>
        ) : null}
      </span>
    </div>
  );
}

function normalizeUserMessageContent(content) {
  return String(content).replace(/\s+/g, " ").trim();
}

function buildUserMessageWrap(content, font, maxWidth) {
  const normalizedContent = normalizeUserMessageContent(content);

  if (!normalizedContent || maxWidth <= 0) {
    return { lines: [normalizedContent], width: null };
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return { lines: [normalizedContent], width: null };
  }

  context.font = font;

  const measureText = (text) => context.measureText(text).width;
  const singleLineWidth = measureText(normalizedContent);

  if (singleLineWidth <= maxWidth) {
    return { lines: [normalizedContent], width: Math.ceil(singleLineWidth + 1) };
  }

  const words = normalizedContent.split(" ");
  const lineWidths = new Map();

  const getLine = (startIndex, endIndex) => words.slice(startIndex, endIndex).join(" ");
  const getLineWidth = (startIndex, endIndex) => {
    const key = `${startIndex}:${endIndex}`;
    const cachedWidth = lineWidths.get(key);

    if (cachedWidth !== undefined) {
      return cachedWidth;
    }

    const measuredWidth = measureText(getLine(startIndex, endIndex));
    lineWidths.set(key, measuredWidth);
    return measuredWidth;
  };

  const scoreLines = (lines) => {
    const widths = lines.map(({ width }) => width);
    const widestLine = Math.max(...widths);
    const ascendingPenalty = widths.reduce((penalty, width, index) => {
      const nextWidth = widths[index + 1];
      return nextWidth && nextWidth > width ? penalty + (nextWidth - width) : penalty;
    }, 0);
    const ragPenalty = widths.reduce((penalty, width) => penalty + Math.abs(widestLine - width), 0);

    return widestLine + ascendingPenalty * 4 + ragPenalty * 0.04;
  };

  const findBestLines = (targetLineCount) => {
    const candidates = [];

    const visit = (startIndex, remainingLines, lines) => {
      if (remainingLines === 1) {
        const width = getLineWidth(startIndex, words.length);

        if (width <= maxWidth || startIndex === words.length - 1) {
          candidates.push([...lines, { text: getLine(startIndex, words.length), width }]);
        }

        return;
      }

      const lastBreakIndex = words.length - remainingLines + 1;

      for (let endIndex = startIndex + 1; endIndex <= lastBreakIndex; endIndex += 1) {
        const width = getLineWidth(startIndex, endIndex);

        if (width > maxWidth && endIndex > startIndex + 1) {
          break;
        }

        visit(endIndex, remainingLines - 1, [...lines, { text: getLine(startIndex, endIndex), width }]);
      }
    };

    visit(0, targetLineCount, []);

    if (candidates.length === 0) {
      return null;
    }

    return candidates.reduce((bestCandidate, candidate) =>
      scoreLines(candidate) < scoreLines(bestCandidate) ? candidate : bestCandidate,
    );
  };

  const firstLineCount = Math.max(2, Math.ceil(singleLineWidth / maxWidth));
  const maxLineCount = Math.min(words.length, firstLineCount + 2);

  for (let lineCount = firstLineCount; lineCount <= maxLineCount; lineCount += 1) {
    const bestLines = findBestLines(lineCount);

    if (bestLines) {
      const widestLine = Math.max(...bestLines.map(({ width }) => width));
      return {
        lines: bestLines.map(({ text }) => text),
        width: Math.min(maxWidth, Math.ceil(widestLine + 1)),
      };
    }
  }

  return { lines: [normalizedContent], width: Math.ceil(maxWidth) };
}

function UserMessage({ content, time, compactTop = false, showAvatar = true, showMeta = true }) {
  const messageBlockRef = useRef(null);
  const messageRef = useRef(null);
  const [wrappedMessage, setWrappedMessage] = useState(() => ({
    lines: [normalizeUserMessageContent(content)],
    width: null,
  }));

  useLayoutEffect(() => {
    const messageBlock = messageBlockRef.current;
    const message = messageRef.current;

    if (!messageBlock || !message) {
      return undefined;
    }

    let isCancelled = false;

    const wrapMessage = () => {
      if (isCancelled) {
        return;
      }

      const messageStyles = window.getComputedStyle(message);
      const horizontalPadding =
        (parseFloat(messageStyles.paddingLeft) || 0) + (parseFloat(messageStyles.paddingRight) || 0);
      const maxBorderBoxWidth = messageBlock.getBoundingClientRect().width * USER_MESSAGE_MAX_WIDTH_RATIO;
      const maxContentWidth = Math.max(0, maxBorderBoxWidth - horizontalPadding - USER_MESSAGE_WIDTH_GUARD);
      const nextWrappedMessage = buildUserMessageWrap(content, messageStyles.font, maxContentWidth);

      if (nextWrappedMessage.width) {
        nextWrappedMessage.width = Math.min(
          maxBorderBoxWidth,
          nextWrappedMessage.width + horizontalPadding + USER_MESSAGE_WIDTH_GUARD,
        );
      }

      setWrappedMessage((currentWrappedMessage) => {
        const currentLines = currentWrappedMessage.lines.join("\n");
        const nextLines = nextWrappedMessage.lines.join("\n");

        if (currentLines === nextLines && currentWrappedMessage.width === nextWrappedMessage.width) {
          return currentWrappedMessage;
        }

        return nextWrappedMessage;
      });
    };

    wrapMessage();

    const resizeObserver = new ResizeObserver(wrapMessage);
    resizeObserver.observe(messageBlock);

    if (document.fonts) {
      void document.fonts.ready.then(wrapMessage);
    }

    return () => {
      isCancelled = true;
      resizeObserver.disconnect();
    };
  }, [content]);

  return (
    <div className={compactTop ? "chat-item chat-item--user chat-item--user-compact" : "chat-item chat-item--user"}>
      <div className="message-row message-row--user">
        <div className="user-message-block" ref={messageBlockRef}>
          <div
            className="user-message"
            ref={messageRef}
            aria-label={normalizeUserMessageContent(content)}
            style={wrappedMessage.width ? { inlineSize: `${wrappedMessage.width}px` } : undefined}
          >
            {wrappedMessage.lines.map((line, index) => (
              <span className="user-message__line" key={`${line}-${index}`}>
                {line}
              </span>
            ))}
          </div>
          {showMeta ? <MessageMeta time={time} align="right" showCopy={false} showBranch={false} /> : null}
        </div>
        {showAvatar ? <div className="avatar-badge" aria-hidden="true">U</div> : <div className="avatar-spacer" aria-hidden="true" />}
      </div>
    </div>
  );
}

function AssistantMessage({ content, time }) {
  const lines = Array.isArray(content) ? content : [content];
  const [lead, ...rest] = lines;

  return (
    <div className="chat-item chat-item--assistant">
      <article className="assistant-message">
        <p>{lead}</p>

        {rest.length > 0 ? (
          <ul>
            {rest.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : null}
      </article>

      <MessageMeta time={time} />
    </div>
  );
}

function TodoSurface({ items }) {
  return (
    <section className="todo-surface">
      <ol className="todo-surface__list">
        {items.map((item) => (
          <li key={item.id} className={`todo-surface__item todo-surface__item--${item.state}`}>
            <span className="todo-surface__bullet" aria-hidden="true" />
            <span className="todo-surface__label">{item.label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function AgentsSurface({ items, isClosed = false }) {
  const speedLabelById = {
    Fast: "fast",
    Standart: "standart",
  };
  const getSpeedLabel = (speed) => {
    const speedLabel = speedLabelById[speed] ?? String(speed ?? "").toLowerCase();

    return speedLabel === "standart" || speedLabel === "standard" ? null : speedLabel;
  };
  const prioritizedItems = [...items]
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const leftPriority = left.item.status === "running" ? 0 : 1;
      const rightPriority = right.item.status === "running" ? 0 : 1;

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      return left.index - right.index;
    })
    .map(({ item }) => item);

  return (
    <section className="agents-surface">
      <ul className="agents-surface__list">
        {prioritizedItems.map((item) => {
          const speedLabel = getSpeedLabel(item.speed);

          return (
            <li key={item.id} className="agents-surface__item">
              <span
                className={`agents-surface__status agents-surface__status--${item.status}${isClosed ? " agents-surface__status--closed" : ""}`}
                aria-hidden="true"
              />
              <div className="agents-surface__identity">
                <strong className="agents-surface__name">{item.name}</strong>
                {item.role ? <span className="agents-surface__role">[{item.role}]</span> : null}
              </div>

              <div className="agents-surface__details">
                <span className="agents-surface__meta">{item.model}</span>
                <span className="agents-surface__meta agents-surface__meta--effort">{item.effort ?? "high"}</span>
                {speedLabel ? (
                  <span className="agents-surface__meta agents-surface__meta--speed">{speedLabel}</span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function RenderSurface({ surface, isCollapsed = false, onToggleCollapse }) {
  const normalizedSurface = normalizeRenderSurface(surface);

  if (!normalizedSurface) {
    return null;
  }

  const hasTodo = normalizedSurface.todo.length > 0;
  const hasAgents = normalizedSurface.agents.length > 0;
  const completedCount = normalizedSurface.todo.filter((item) => item.state === "done").length;
  const summary = hasTodo ? `${completedCount} out of ${normalizedSurface.todo.length} tasks completed` : null;
  const mode = hasTodo && hasAgents ? "split" : hasTodo ? "todo-only" : "agents-only";
  const isSplitMode = mode === "split";
  const agentsHeading = hasAgents ? (
    <div className="render-surface__agents-heading">
      <span className="agents-surface__count">{normalizedSurface.agents.length}</span>
      <span className="agents-surface__eyebrow">Agents</span>
    </div>
  ) : null;
  const toggleButton = (
    <button
      className={`render-surface__toggle render-surface__toggle--${isSplitMode ? "split" : "single"}`}
      type="button"
      aria-label={isCollapsed ? "Раскрыть окно" : "Свернуть окно"}
      aria-expanded={!isCollapsed}
      onClick={onToggleCollapse}
    >
      {isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </button>
  );

  return (
    <section className={`render-surface render-surface--${mode}${isCollapsed ? " render-surface--collapsed" : ""}`}>
      {isSplitMode ? (
        <div className="render-surface__split-layout">
          {toggleButton}
          <div className="render-surface__split-column render-surface__split-column--todo">
            <div className="render-surface__split-heading">
              <span className="render-surface__summary">{summary}</span>
            </div>
            {!isCollapsed ? <TodoSurface items={normalizedSurface.todo} /> : null}
          </div>

          <div className="render-surface__split-column render-surface__split-column--agents">
            <div className="render-surface__split-heading">{agentsHeading}</div>
            {!isCollapsed ? (
              <AgentsSurface items={normalizedSurface.agents} isClosed={normalizedSurface.isClosed} />
            ) : null}
          </div>
        </div>
      ) : (
        <div className="render-surface__single-layout">
          {toggleButton}
          <div className="render-surface__header-copy">
            {summary ? <span className="render-surface__summary">{summary}</span> : null}
            {!summary ? agentsHeading : null}
          </div>

          {!isCollapsed ? (
            <div className={`render-surface__body render-surface__body--${mode}`}>
              {hasTodo ? (
                <div className="render-surface__pane render-surface__pane--todo-only">
                  <TodoSurface items={normalizedSurface.todo} />
                </div>
              ) : null}

              {hasAgents ? (
                <div className="render-surface__pane render-surface__pane--agents-only">
                  <AgentsSurface items={normalizedSurface.agents} isClosed={normalizedSurface.isClosed} />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

function EmptyCanvas({ target, folders, draftValue }) {
  if (!target) {
    return null;
  }

  const hasTypedDraft = draftValue.trim().length > 0;

  if (target.kind === "folder") {
    const folderTrail = getFolderTrail(target.folderId, folders).join(" / ");

    return (
      <div className="empty-canvas">
        <span className="empty-canvas__eyebrow">Новый чат</span>
        <h2 className="empty-canvas__title">{target.label}</h2>
        <p className="empty-canvas__description">
          Чат появится слева только после первого сообщения. Пока это пустой холст, привязанный к выбранной папке.
        </p>
        <p className="empty-canvas__path">{folderTrail}</p>
        <p className="empty-canvas__note">
          {hasTypedDraft
            ? "Несохранённый текст уже лежит в composer и вернётся при повторном открытии этой же папки."
            : "Нажми на plus у этой папки снова — откроется тот же самый пустой draft, а не новый дубль."}
        </p>
      </div>
    );
  }

  const ancestorFolder = target.closestVisibleHandleFolderId
    ? getFolderById(folders, target.closestVisibleHandleFolderId)
    : null;

  return (
    <div className="empty-canvas">
      <span className="empty-canvas__eyebrow">Новый чат из Files</span>
      <h2 className="empty-canvas__title">{target.name}</h2>
      <p className="empty-canvas__description">
        Папка ещё не отображается слева. После первого сообщения она появится в дереве и получит свой первый тред.
      </p>
      <p className="empty-canvas__path">
        {ancestorFolder
          ? `Будет добавлена внутрь «${ancestorFolder.name}» как ближайшая видимая leaf-папка.`
          : "Будет добавлена как отдельный верхнеуровневый проект в левой панели."}
      </p>
      <p className="empty-canvas__note">
        {hasTypedDraft
          ? "Несохранённый input уже привязан к этой выбранной папке и восстановится, если выбрать её снова."
          : "Даже пустой draft уже закреплён за выбранной папкой: повторный выбор откроет его же, без создания дублей."}
      </p>
    </div>
  );
}

function SettingsModal({
  isOpen,
  selectedTheme,
  selectedChatSurface,
  onClose,
  onSelectTheme,
  onSelectChatSurface,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="settings-modal-layer" role="presentation" onClick={onClose}>
      <div
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <aside className="settings-modal__sidebar">
          <div className="settings-modal__sidebar-title">Settings</div>

          <div className="settings-modal__tablist" role="tablist" aria-label="Settings tabs">
            <button
              id="settings-tab-general"
              className="settings-tab settings-tab--active"
              type="button"
              role="tab"
              aria-selected="true"
              aria-controls="settings-panel-general"
            >
              <span className="settings-tab__icon">
                <SlidersIcon />
              </span>
              <span>General</span>
            </button>
          </div>
        </aside>

        <section
          id="settings-panel-general"
          className="settings-modal__content"
          role="tabpanel"
          aria-labelledby="settings-tab-general"
        >
          <header className="settings-modal__header">
            <div>
              <p className="settings-modal__eyebrow">General</p>
              <h2 id="settings-modal-title">General</h2>
              <p className="settings-modal__description">Базовые настройки интерфейса прототипа.</p>
            </div>

            <button
              className="settings-close-button"
              type="button"
              aria-label="Закрыть настройки"
              onClick={onClose}
            >
              <CloseIcon />
            </button>
          </header>

          <div className="settings-section">
            <div className="settings-section__head">
              <div>
                <p className="settings-section__eyebrow">Appearance</p>
                <h3>Theme</h3>
              </div>

              <p className="settings-section__description">
                Переключает базовую палитру прототипа между нейтральной и тёплой.
              </p>
            </div>

            <div className="theme-options" role="radiogroup" aria-label="Theme">
              {themeOptions.map((option) => {
                const isSelected = option.id === selectedTheme;

                return (
                  <button
                    key={option.id}
                    className={isSelected ? "theme-option theme-option--active" : "theme-option"}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onSelectTheme(option.id)}
                  >
                    <span className="theme-option__preview" aria-hidden="true">
                      {option.swatches.map((swatch) => (
                        <span key={swatch} className="theme-option__swatch" style={{ background: swatch }} />
                      ))}
                    </span>

                    <span className="theme-option__body">
                      <span className="theme-option__title-row">
                        <span className="theme-option__label">{option.label}</span>
                        {isSelected ? <span className="theme-option__status">Active</span> : null}
                      </span>
                      <span className="theme-option__description">{option.description}</span>
                    </span>

                    <span className="theme-option__indicator" aria-hidden="true">
                      {isSelected ? <CheckIcon /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section__head">
              <div>
                <p className="settings-section__eyebrow">Layout</p>
                <h3>Chat panel</h3>
              </div>

              <p className="settings-section__description">Выбирает, как окно чата лежит на общем полотне.</p>
            </div>

            <div className="theme-options chat-surface-options" role="radiogroup" aria-label="Chat panel surface">
              {chatSurfaceOptions.map((option) => {
                const isSelected = option.id === selectedChatSurface;

                return (
                  <button
                    key={option.id}
                    className={isSelected ? "theme-option theme-option--active" : "theme-option"}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onSelectChatSurface(option.id)}
                  >
                    <span
                      className={`chat-surface-option__preview chat-surface-option__preview--${option.id}`}
                      aria-hidden="true"
                    >
                      <span className="chat-surface-option__sidebar" />
                      <span className="chat-surface-option__panel" />
                    </span>

                    <span className="theme-option__body">
                      <span className="theme-option__title-row">
                        <span className="theme-option__label">{option.label}</span>
                        {isSelected ? <span className="theme-option__status">Active</span> : null}
                      </span>
                      <span className="theme-option__description">{option.description}</span>
                    </span>

                    <span className="theme-option__indicator" aria-hidden="true">
                      {isSelected ? <CheckIcon /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function readChatScrollIndicator(chatContent) {
  if (!chatContent) {
    return { visible: false, atBottom: true, top: 0, height: 0 };
  }

  const { scrollTop, scrollHeight, clientHeight } = chatContent;
  const maxScrollTop = Math.max(scrollHeight - clientHeight, 0);
  const hasOverflow = maxScrollTop > 1;

  if (!hasOverflow) {
    return { visible: false, atBottom: true, top: 0, height: 0 };
  }

  const atBottom = scrollTop >= maxScrollTop - 2;
  const trackHeight = Math.max(clientHeight - 36, 0);
  const thumbHeight = Math.max(56, Math.round((clientHeight / scrollHeight) * trackHeight));
  const maxThumbTravel = Math.max(trackHeight - thumbHeight, 0);
  const progress = maxScrollTop === 0 ? 0 : scrollTop / maxScrollTop;
  const thumbTop = 18 + Math.round(maxThumbTravel * progress);

  return {
    visible: true,
    atBottom,
    top: thumbTop,
    height: thumbHeight,
  };
}

function resizeComposer(chatArea, renderSurface, composerBox, composerFooter, composerInput) {
  if (!chatArea || !composerBox || !composerFooter || !composerInput) {
    return;
  }

  const minInputHeight = 24;
  const maxComposerHeight = Math.floor(chatArea.clientHeight / 3);
  const composerStyles = window.getComputedStyle(composerBox);
  const paddingTop = parseFloat(composerStyles.paddingTop);
  const paddingBottom = parseFloat(composerStyles.paddingBottom);
  const maxInputHeight = Math.max(
    minInputHeight,
    maxComposerHeight - composerFooter.offsetHeight - paddingTop - paddingBottom,
  );

  composerBox.style.maxHeight = `${maxComposerHeight}px`;
  composerInput.style.height = "0px";

  const nextHeight = Math.max(composerInput.scrollHeight, minInputHeight);
  const clampedHeight = Math.min(nextHeight, maxInputHeight);

  composerInput.style.height = `${clampedHeight}px`;
  composerInput.style.overflowY = nextHeight > maxInputHeight ? "auto" : "hidden";

  const renderSurfaceHeight = renderSurface?.offsetHeight ?? 0;
  const renderSurfaceOverlap = renderSurface
    ? parseFloat(window.getComputedStyle(renderSurface).getPropertyValue("--composer-surface-overlap")) || 0
    : 0;
  const composerBottomOffset =
    parseFloat(window.getComputedStyle(chatArea).getPropertyValue("--composer-bottom-offset")) || 0;
  const composerReservedSpace =
    composerBox.offsetHeight +
    renderSurfaceHeight -
    Math.min(renderSurfaceHeight, renderSurfaceOverlap) +
    composerBottomOffset +
    22;
  chatArea.style.setProperty("--composer-reserved-space", `${composerReservedSpace}px`);
}

export default function App() {
  const [folders, setFolders] = useState(() => initialFolders);
  const [threads, setThreads] = useState(() => initialThreads);
  const [threadDrafts, setThreadDrafts] = useState(() => ({}));
  const [folderDrafts, setFolderDrafts] = useState(() => initialFolderDrafts);
  const [pendingFolderTargets, setPendingFolderTargets] = useState(() => []);
  const [activePane, setActivePane] = useState(() => ({ type: "thread", threadId: defaultActiveThreadId }));
  const [openMenu, setOpenMenu] = useState(null);
  const [includeIdeContext, setIncludeIdeContext] = useState(true);
  const [planMode, setPlanMode] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState("default");
  const [selectedBranch, setSelectedBranch] = useState("prototype-sidebar-polish");
  const [selectedModel, setSelectedModel] = useState("gpt-5.4");
  const [selectedReasoning, setSelectedReasoning] = useState("high");
  const [selectedContinueMode, setSelectedContinueMode] = useState("local");
  const [selectedTheme, setSelectedTheme] = useState("grey");
  const [selectedChatSurface, setSelectedChatSurface] = useState("inside");
  const [threadRenderSurfaces, setThreadRenderSurfaces] = useState(() => initialThreadRenderSurfaces);
  const [collapsedRenderSurfaces, setCollapsedRenderSurfaces] = useState(() => ({}));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatScrollIndicator, setChatScrollIndicator] = useState(() => ({
    visible: false,
    atBottom: true,
    top: 0,
    height: 0,
  }));
  const [isChatScrollIndicatorHidden, setIsChatScrollIndicatorHidden] = useState(false);
  const chatAreaRef = useRef(null);
  const chatContentRef = useRef(null);
  const composerRegionRef = useRef(null);
  const renderSurfaceRef = useRef(null);
  const composerBoxRef = useRef(null);
  const composerFooterRef = useRef(null);
  const composerInputRef = useRef(null);
  const chatScrollIndicatorTimeoutRef = useRef(null);
  const chatScrollDragStateRef = useRef(null);
  const foldersRef = useRef(folders);
  const pendingFolderTargetsRef = useRef(pendingFolderTargets);

  useEffect(() => {
    foldersRef.current = folders;
  }, [folders]);

  useEffect(() => {
    pendingFolderTargetsRef.current = pendingFolderTargets;
  }, [pendingFolderTargets]);

  const rootEntries = buildVisibleRootEntries(folders, threads);
  const activeThread = activePane.type === "thread" ? getThreadById(threads, activePane.threadId) : null;
  const activeDraftTarget = activePane.type === "draft" ? getDraftTarget(activePane.targetKey, folders, pendingFolderTargets) : null;
  const activeComposerText =
    activePane.type === "thread"
      ? threadDrafts[activePane.threadId] ?? ""
      : activePane.type === "draft"
        ? folderDrafts[activePane.targetKey] ?? ""
        : "";
  const isDirectoryPickerAvailable =
    typeof window !== "undefined" && typeof window.showDirectoryPicker === "function";
  const selectedPermissionLabel = getSelectedLabel(permissionOptions, selectedPermission);
  const selectedBranchOption = branchOptions.find((branch) => branch.id === selectedBranch) ?? branchOptions[0];
  const selectedModelLabel = getSelectedLabel(modelOptions, selectedModel);
  const selectedReasoningLabel = getSelectedLabel(reasoningOptions, selectedReasoning);
  const activeRenderSurface =
    activePane.type === "thread" ? normalizeRenderSurface(threadRenderSurfaces[activePane.threadId]) : null;
  const isActiveRenderSurfaceCollapsed =
    activePane.type === "thread" ? collapsedRenderSurfaces[activePane.threadId] ?? false : false;

  useLayoutEffect(() => {
    resizeComposer(
      chatAreaRef.current,
      renderSurfaceRef.current,
      composerBoxRef.current,
      composerFooterRef.current,
      composerInputRef.current,
    );
  }, [
    activeComposerText,
    activePane.type,
    activeThread?.id,
    activeDraftTarget?.key,
    activeRenderSurface,
    isActiveRenderSurfaceCollapsed,
  ]);

  useLayoutEffect(() => {
    const chatArea = chatAreaRef.current;

    if (!chatArea) {
      return undefined;
    }

    const handleResize = () =>
      resizeComposer(
        chatAreaRef.current,
        renderSurfaceRef.current,
        composerBoxRef.current,
        composerFooterRef.current,
        composerInputRef.current,
      );

    handleResize();

    const observer = new ResizeObserver(handleResize);
    observer.observe(chatArea);
    if (composerBoxRef.current) {
      observer.observe(composerBoxRef.current);
    }
    if (renderSurfaceRef.current) {
      observer.observe(renderSurfaceRef.current);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [activeThread?.id, activeRenderSurface, isActiveRenderSurfaceCollapsed]);

  useEffect(() => {
    const chatContent = chatContentRef.current;
    const chatArea = chatAreaRef.current;

    if (!chatContent || !chatArea) {
      return undefined;
    }

    const updateIndicator = () => {
      setChatScrollIndicator(readChatScrollIndicator(chatContentRef.current));
    };

    updateIndicator();
    chatContent.addEventListener("scroll", updateIndicator, { passive: true });

    const observer = new ResizeObserver(updateIndicator);
    observer.observe(chatContent);
    observer.observe(chatArea);
    window.addEventListener("resize", updateIndicator);

    return () => {
      chatContent.removeEventListener("scroll", updateIndicator);
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeThread?.id, activeDraftTarget?.key, threads]);

  useEffect(() => {
    if (chatScrollIndicatorTimeoutRef.current) {
      window.clearTimeout(chatScrollIndicatorTimeoutRef.current);
      chatScrollIndicatorTimeoutRef.current = null;
    }

    if (!chatScrollIndicator.visible) {
      setIsChatScrollIndicatorHidden(true);
      return undefined;
    }

    if (!chatScrollIndicator.atBottom) {
      setIsChatScrollIndicatorHidden(false);
      return undefined;
    }

    chatScrollIndicatorTimeoutRef.current = window.setTimeout(() => {
      setIsChatScrollIndicatorHidden(true);
      chatScrollIndicatorTimeoutRef.current = null;
    }, 2000);

    return () => {
      if (chatScrollIndicatorTimeoutRef.current) {
        window.clearTimeout(chatScrollIndicatorTimeoutRef.current);
        chatScrollIndicatorTimeoutRef.current = null;
      }
    };
  }, [chatScrollIndicator.atBottom, chatScrollIndicator.visible]);

  useEffect(() => {
    if (!openMenu) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!composerRegionRef.current?.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenu]);

  useEffect(() => {
    if (!isSettingsOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSettingsOpen]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const dragState = chatScrollDragStateRef.current;
      const chatContent = chatContentRef.current;

      if (!dragState || !chatContent) {
        return;
      }

      const deltaY = event.clientY - dragState.startClientY;
      const nextScrollTop =
        dragState.startScrollTop + (deltaY / dragState.maxThumbTravel) * dragState.maxScrollTop;

      chatContent.scrollTop = Math.max(0, Math.min(dragState.maxScrollTop, nextScrollTop));
    };

    const stopDragging = () => {
      if (!chatScrollDragStateRef.current) {
        return;
      }

      chatScrollDragStateRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);

  const handleToggleExpanded = (folderId) => {
    startTransition(() => {
      setFolders((currentFolders) =>
        currentFolders.map((folder) =>
          folder.id === folderId ? { ...folder, expanded: !folder.expanded } : folder,
        ),
      );
    });
  };

  const handleSelectThread = (threadId) => {
    startTransition(() => {
      setActivePane({ type: "thread", threadId });
    });
  };

  const openDraftForFolder = (folderId) => {
    startTransition(() => {
      setFolders((currentFolders) => expandFolderLineage(currentFolders, folderId));
      setActivePane({ type: "draft", targetKey: getFolderTargetKey(folderId) });
    });
  };

  const handleToggleFavorite = (threadId) => {
    startTransition(() => {
      setThreads((currentThreads) =>
        currentThreads.map((thread) =>
          thread.id === threadId ? { ...thread, favorite: !thread.favorite } : thread,
        ),
      );
    });
  };

  const handleToggleProjectFavorite = (folderId) => {
    startTransition(() => {
      setFolders((currentFolders) =>
        currentFolders.map((folder) =>
          folder.id === folderId ? { ...folder, favorite: !folder.favorite } : folder,
        ),
      );
    });
  };

  const handleComposerChange = (nextValue) => {
    if (activePane.type === "thread") {
      setThreadDrafts((currentDrafts) => ({
        ...currentDrafts,
        [activePane.threadId]: nextValue,
      }));
      return;
    }

    if (activePane.type === "draft") {
      setFolderDrafts((currentDrafts) => ({
        ...currentDrafts,
        [activePane.targetKey]: nextValue,
      }));
    }
  };

  const materializePendingTargetFolder = async (target) => {
    const currentFolders = foldersRef.current;
    const exactFolder = await findFolderByHandle(target.handle, currentFolders);

    if (exactFolder) {
      return {
        folderId: exactFolder.id,
        nextFolders: expandFolderLineage(currentFolders, exactFolder.id),
      };
    }

    const closestAncestor = await findClosestVisibleHandleAncestor(target.handle, currentFolders);
    const newFolderId = makeId("folder");
    const nextFolder = {
      id: newFolderId,
      kind: closestAncestor ? "folder" : "root",
      name: target.name,
      displayPath: closestAncestor ? null : "Files folder",
      parentId: closestAncestor?.id ?? null,
      expanded: true,
      order: getNextFolderOrder(currentFolders, closestAncestor?.id ?? null),
      source: "picker",
      handle: target.handle,
    };

    let nextFolders = [...currentFolders, nextFolder];
    nextFolders = await normalizeHandleFolderHierarchy(nextFolders);
    nextFolders = expandFolderLineage(nextFolders, newFolderId);

    return {
      folderId: newFolderId,
      nextFolders,
    };
  };

  const handleOpenFolderPicker = async () => {
    if (!isDirectoryPickerAvailable) {
      return;
    }

    try {
      const directoryHandle = await window.showDirectoryPicker();
      const currentFolders = foldersRef.current;
      const currentPendingTargets = pendingFolderTargetsRef.current;
      const exactFolder = await findFolderByHandle(directoryHandle, currentFolders);

      if (exactFolder) {
        openDraftForFolder(exactFolder.id);
        return;
      }

      const existingPendingTarget = await findPendingTargetByHandle(directoryHandle, currentPendingTargets);

      if (existingPendingTarget) {
        startTransition(() => {
          setActivePane({ type: "draft", targetKey: existingPendingTarget.key });
        });
        return;
      }

      const closestVisibleHandleFolder = await findClosestVisibleHandleAncestor(directoryHandle, currentFolders);
      const nextTarget = {
        key: makeId("pending-folder"),
        kind: "pending-folder",
        name: directoryHandle.name,
        handle: directoryHandle,
        closestVisibleHandleFolderId: closestVisibleHandleFolder?.id ?? null,
      };

      startTransition(() => {
        setPendingFolderTargets((currentTargets) => [...currentTargets, nextTarget]);
        setActivePane({ type: "draft", targetKey: nextTarget.key });
      });
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error(error);
      }
    }
  };

  const handleSendMessage = async () => {
    const normalizedMessage = activeComposerText.trim();

    if (!normalizedMessage) {
      return;
    }

    if (activePane.type === "thread") {
      const targetThread = getThreadById(threads, activePane.threadId);

      if (!targetThread) {
        return;
      }

      const targetFolder = getFolderById(folders, targetThread.folderId);
      const userMessage = createUserMessage(normalizedMessage);
      const assistantMessage = createAssistantMessage(normalizedMessage, targetFolder?.name ?? "чат");
      const nextUpdatedAt = assistantMessage.createdAt;

      startTransition(() => {
        setThreads((currentThreads) =>
          currentThreads.map((thread) =>
            thread.id === activePane.threadId
              ? {
                  ...thread,
                  updatedAt: nextUpdatedAt,
                  messages: [...thread.messages, userMessage, assistantMessage],
                }
              : thread,
          ),
        );

        setThreadDrafts((currentDrafts) => ({
          ...currentDrafts,
          [activePane.threadId]: "",
        }));
        setThreadRenderSurfaces((currentSurfaces) => {
          const nextSurface = buildThreadRenderSurface(
            normalizedMessage,
            targetFolder?.name ?? "чат",
            currentSurfaces[activePane.threadId] ?? null,
          );

          if (!nextSurface || nextSurface === currentSurfaces[activePane.threadId]) {
            return currentSurfaces;
          }

          return {
            ...currentSurfaces,
            [activePane.threadId]: nextSurface,
          };
        });
      });

      return;
    }

    if (activePane.type !== "draft") {
      return;
    }

    const draftTarget = getDraftTarget(activePane.targetKey, foldersRef.current, pendingFolderTargetsRef.current);

    if (!draftTarget) {
      return;
    }

    let resolvedFolderId = draftTarget.folderId ?? null;
    let nextFolders = foldersRef.current;

    if (draftTarget.kind === "pending-folder") {
      const materializedFolder = await materializePendingTargetFolder(draftTarget);
      resolvedFolderId = materializedFolder.folderId;
      nextFolders = materializedFolder.nextFolders;
    } else if (draftTarget.kind === "folder") {
      nextFolders = expandFolderLineage(foldersRef.current, draftTarget.folderId);
    }

    if (!resolvedFolderId) {
      return;
    }

    const targetFolder = getFolderById(nextFolders, resolvedFolderId);
    const nextThreadId = makeId("thread");
    const userMessage = createUserMessage(normalizedMessage);
    const assistantMessage = createAssistantMessage(normalizedMessage, targetFolder?.name ?? "чат", true);
    const nextRenderSurface = buildThreadRenderSurface(normalizedMessage, targetFolder?.name ?? "чат");
    const nextThread = {
      id: nextThreadId,
      folderId: resolvedFolderId,
      title: trimThreadTitle(normalizedMessage),
      status: threads.length % 2 === 0 ? "orange" : "green",
      favorite: false,
      updatedAt: assistantMessage.createdAt,
      messages: [userMessage, assistantMessage],
    };

    startTransition(() => {
      setFolders(nextFolders);
      setThreads((currentThreads) => [...currentThreads, nextThread]);
      setFolderDrafts((currentDrafts) => ({
        ...currentDrafts,
        [activePane.targetKey]: "",
      }));
      setPendingFolderTargets((currentTargets) =>
        currentTargets.filter((target) => target.key !== activePane.targetKey),
      );
      setActivePane({ type: "thread", threadId: nextThreadId });
      if (nextRenderSurface) {
        setThreadRenderSurfaces((currentSurfaces) => ({
          ...currentSurfaces,
          [nextThreadId]: nextRenderSurface,
        }));
      }
    });
  };

  const handleComposerKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
  };

  const handleToggleSettings = () => {
    setOpenMenu(null);
    setIsSettingsOpen((currentValue) => !currentValue);
  };

  const handleToggleRenderSurface = () => {
    if (activePane.type !== "thread") {
      return;
    }

    setCollapsedRenderSurfaces((currentState) => ({
      ...currentState,
      [activePane.threadId]: !(currentState[activePane.threadId] ?? false),
    }));
  };

  const handleSelectTheme = (themeId) => {
    if (themeId === selectedTheme) {
      return;
    }

    startTransition(() => {
      setSelectedTheme(themeId);
    });
  };

  const handleSelectChatSurface = (surfaceId) => {
    if (surfaceId === selectedChatSurface) {
      return;
    }

    startTransition(() => {
      setSelectedChatSurface(surfaceId);
    });
  };

  const handleChatScrollThumbPointerDown = (event) => {
    const chatContent = chatContentRef.current;

    if (!chatContent || !chatScrollIndicator.visible) {
      return;
    }

    const maxScrollTop = Math.max(chatContent.scrollHeight - chatContent.clientHeight, 0);
    const trackHeight = Math.max(chatContent.clientHeight - 36, 0);
    const maxThumbTravel = Math.max(trackHeight - chatScrollIndicator.height, 0);

    if (maxScrollTop <= 0 || maxThumbTravel <= 0) {
      return;
    }

    event.preventDefault();
    setIsChatScrollIndicatorHidden(false);

    if (chatScrollIndicatorTimeoutRef.current) {
      window.clearTimeout(chatScrollIndicatorTimeoutRef.current);
      chatScrollIndicatorTimeoutRef.current = null;
    }

    chatScrollDragStateRef.current = {
      startClientY: event.clientY,
      startScrollTop: chatContent.scrollTop,
      maxScrollTop,
      maxThumbTravel,
    };

    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  };

  const activeThreadMessages = activeThread?.messages ?? [];
  const composerPlaceholder =
    activePane.type === "draft" ? "Напишите первое сообщение, чтобы создать чат..." : "Спросите у агента что-нибудь...";
  const sendButtonDisabled = activeComposerText.trim().length === 0;
  const activeFolderPath =
    activeThread?.folderId
      ? buildFolderDisplayPath(activeThread.folderId, folders)
      : activeDraftTarget?.kind === "folder"
        ? buildFolderDisplayPath(activeDraftTarget.folderId, folders)
        : activeDraftTarget?.kind === "pending-folder"
          ? activeDraftTarget.name
          : "Codex Agent";

  return (
    <div className="app-root" data-theme={selectedTheme} data-chat-surface={selectedChatSurface}>
      <div className="window-caption">Дизайн приложения-агента</div>

      <div className="desktop-window">
        <div className="window-toolbar" aria-label="Панель окна">
          <div className="window-toolbar__path" title={activeFolderPath}>
            {activeFolderPath}
          </div>

          <div className="window-toolbar__controls">
            <button className="window-control" type="button" aria-label="Свернуть окно">
              <WindowMinimizeIcon />
            </button>
            <button className="window-control" type="button" aria-label="Развернуть окно">
              <WindowMaximizeIcon />
            </button>
            <button className="window-control window-control--close" type="button" aria-label="Закрыть окно">
              <CloseIcon />
            </button>
          </div>
        </div>

        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="sidebar-title-row">
              <h1>Codex Agent</h1>
              <button
                className="icon-button"
                type="button"
                aria-label="Настройки"
                aria-expanded={isSettingsOpen}
                onClick={handleToggleSettings}
              >
                <GearIcon />
              </button>
            </div>

            <label className="search-field">
              <span className="search-field__icon">
                <SearchIcon />
              </span>
              <span className="search-field__placeholder">Поиск</span>
            </label>

            <button
              className="sidebar-action-row"
              type="button"
              aria-label="Новый чат"
              disabled={!isDirectoryPickerAvailable}
              onClick={() => {
                void handleOpenFolderPicker();
              }}
            >
              <span className="sidebar-action-row__icon">
                <PlusIcon />
              </span>
              <span>Новый чат</span>
            </button>
          </div>

          <div className="sidebar-body">
            <section className="tree-block">
              <SidebarTree
                rootEntries={rootEntries}
                folders={folders}
                threads={threads}
                activeThreadId={activeThread?.id ?? null}
                onToggleExpanded={handleToggleExpanded}
                onOpenDraft={openDraftForFolder}
                onSelectThread={handleSelectThread}
                onToggleFavorite={handleToggleFavorite}
                onToggleProjectFavorite={handleToggleProjectFavorite}
              />
            </section>
          </div>
        </aside>

        <main className="chat-area" ref={chatAreaRef}>
          <section
            className={activePane.type === "draft" ? "chat-content chat-content--canvas" : "chat-content"}
            ref={chatContentRef}
          >
            {activePane.type === "thread" && activeThread
              ? activeThreadMessages.map((message, index) => {
                  const previousMessage = activeThreadMessages[index - 1] ?? null;
                  const nextMessage = activeThreadMessages[index + 1] ?? null;

                  return message.role === "user" ? (
                    <UserMessage
                      key={message.id}
                      content={message.content}
                      time={formatChatTime(message.createdAt)}
                      compactTop={isSameMinuteUserMessage(message, previousMessage)}
                      showAvatar={!isSameMinuteUserMessage(message, previousMessage)}
                      showMeta={!isSameMinuteUserMessage(message, nextMessage)}
                    />
                  ) : (
                    <AssistantMessage
                      key={message.id}
                      content={message.content}
                      time={formatChatTime(message.createdAt)}
                    />
                  );
                })
              : <EmptyCanvas target={activeDraftTarget} folders={folders} draftValue={activeComposerText} />}
          </section>

          {chatScrollIndicator.visible ? (
            <div
              className={
                isChatScrollIndicatorHidden
                  ? "chat-scroll-indicator chat-scroll-indicator--hidden"
                  : "chat-scroll-indicator"
              }
              aria-hidden="true"
            >
              <div
                className="chat-scroll-indicator__thumb"
                onPointerDown={handleChatScrollThumbPointerDown}
                style={{
                  transform: `translateY(${chatScrollIndicator.top}px)`,
                  height: `${chatScrollIndicator.height}px`,
                }}
              />
            </div>
          ) : null}

          <div className="chat-scroll-fade" aria-hidden="true" />

          <footer className="composer-region" ref={composerRegionRef}>
            {activeRenderSurface ? (
              <div className="render-surface-shell" ref={renderSurfaceRef}>
                <RenderSurface
                  surface={activeRenderSurface}
                  isCollapsed={isActiveRenderSurfaceCollapsed}
                  onToggleCollapse={handleToggleRenderSurface}
                />
              </div>
            ) : null}

            <div className="composer-box" ref={composerBoxRef}>
              <textarea
                ref={composerInputRef}
                className="composer-input"
                placeholder={composerPlaceholder}
                value={activeComposerText}
                onChange={(event) => handleComposerChange(event.target.value)}
                onKeyDown={handleComposerKeyDown}
              />

              <div className="composer-footer" ref={composerFooterRef}>
                <div className="composer-footer__left">
                  <div className="composer-menu-anchor composer-menu-anchor--left">
                    <button
                      className="composer-plus-button"
                      type="button"
                      aria-label="Добавить"
                      aria-expanded={openMenu === "quick-actions"}
                      onClick={() =>
                        setOpenMenu((currentMenu) =>
                          currentMenu === "quick-actions" ? null : "quick-actions",
                        )
                      }
                    >
                      <PlusIcon />
                    </button>

                    {openMenu === "quick-actions" ? (
                      <QuickActionsMenu
                        includeIdeContext={includeIdeContext}
                        planMode={planMode}
                        selectedContinueMode={selectedContinueMode}
                        onToggleIdeContext={() => setIncludeIdeContext((currentValue) => !currentValue)}
                        onTogglePlanMode={() => setPlanMode((currentValue) => !currentValue)}
                        onSelectContinueMode={(optionId) => {
                          setSelectedContinueMode(optionId);
                          setOpenMenu(null);
                        }}
                      />
                    ) : null}
                  </div>

                  <div className="composer-menu-anchor composer-menu-anchor--left">
                    <button
                      className={
                        selectedPermission === "full"
                          ? "composer-pill composer-pill--warning composer-pill--filled"
                          : "composer-pill composer-pill--filled"
                      }
                      type="button"
                      aria-expanded={openMenu === "permissions"}
                      onClick={() =>
                        setOpenMenu((currentMenu) =>
                          currentMenu === "permissions" ? null : "permissions",
                        )
                      }
                    >
                      <span className="composer-pill__icon">
                        <HandIcon />
                      </span>
                      <span className="composer-pill__label">{selectedPermissionLabel}</span>
                      <span className="composer-pill__chevron">
                        <ChevronDownIcon />
                      </span>
                    </button>

                    {openMenu === "permissions" ? (
                      <ComposerMenu
                        className="composer-menu--permissions composer-menu--left"
                        options={permissionOptions}
                        selectedId={selectedPermission}
                        showIcons
                        onSelect={(optionId) => {
                          setSelectedPermission(optionId);
                          setOpenMenu(null);
                        }}
                      />
                    ) : null}
                  </div>

                  <div className="composer-menu-anchor composer-menu-anchor--left">
                    <button
                      className="branch-switcher"
                      type="button"
                      aria-label="Переключить ветку"
                      aria-expanded={openMenu === "branch"}
                      onClick={() => setOpenMenu((currentMenu) => (currentMenu === "branch" ? null : "branch"))}
                    >
                      <span className="branch-switcher__icon">
                        <BranchIcon />
                      </span>
                      <span className="branch-switcher__label">{selectedBranchOption.label}</span>
                      <span className="branch-switcher__chevron">
                        <ChevronDownIcon />
                      </span>
                    </button>

                    {openMenu === "branch" ? (
                      <BranchMenu
                        selectedBranchId={selectedBranch}
                        onSelectBranch={(branchId) => {
                          setSelectedBranch(branchId);
                          setOpenMenu(null);
                        }}
                      />
                    ) : null}
                  </div>
                </div>

                <div className="composer-footer__right">
                  <button className="composer-usage" type="button" aria-label="Использование контекстного окна">
                    <span className="composer-usage__ring" aria-hidden="true">
                    </span>
                    <span className="composer-usage__value">73%</span>
                    <span className="composer-usage__tooltip" role="tooltip">
                      <span>Остаток контекста:</span>
                      <strong>73% доступно</strong>
                      <span>5-часовой лимит: 41% осталось</span>
                      <span>Недельный лимит: 68% осталось</span>
                      <span>Следующее обновление 5ч окна через 2ч 15м</span>
                    </span>
                  </button>

                  <div className="composer-menu-anchor composer-menu-anchor--right">
                    <button
                      className="composer-pill composer-pill--filled"
                      type="button"
                      aria-expanded={openMenu === "model"}
                      onClick={() => setOpenMenu((currentMenu) => (currentMenu === "model" ? null : "model"))}
                    >
                      <span className="composer-pill__label">{selectedModelLabel}</span>
                      <span className="composer-pill__chevron">
                        <ChevronDownIcon />
                      </span>
                    </button>

                    {openMenu === "model" ? (
                      <ComposerMenu
                        title="Model"
                        className="composer-menu--model composer-menu--right"
                        options={modelOptions}
                        selectedId={selectedModel}
                        onSelect={(optionId) => {
                          setSelectedModel(optionId);
                          setOpenMenu(null);
                        }}
                      />
                    ) : null}
                  </div>

                  <div className="composer-menu-anchor composer-menu-anchor--right">
                    <button
                      className="composer-pill composer-pill--filled"
                      type="button"
                      aria-expanded={openMenu === "reasoning"}
                      onClick={() =>
                        setOpenMenu((currentMenu) =>
                          currentMenu === "reasoning" ? null : "reasoning",
                        )
                      }
                    >
                      <span className="composer-pill__label">{selectedReasoningLabel}</span>
                      <span className="composer-pill__chevron">
                        <ChevronDownIcon />
                      </span>
                    </button>

                    {openMenu === "reasoning" ? (
                      <ComposerMenu
                        title="Reasoning"
                        className="composer-menu--reasoning composer-menu--right"
                        options={reasoningOptions}
                        selectedId={selectedReasoning}
                        onSelect={(optionId) => {
                          setSelectedReasoning(optionId);
                          setOpenMenu(null);
                        }}
                      />
                    ) : null}
                  </div>

                  <button
                    className={includeIdeContext ? "composer-context" : "composer-context composer-context--inactive"}
                    type="button"
                    onClick={() => setIncludeIdeContext((currentValue) => !currentValue)}
                  >
                    <span className="composer-context__icon">
                      <SparklesIcon />
                    </span>
                    <span>IDE context</span>
                  </button>

                  <button
                    className={
                      sendButtonDisabled
                        ? "composer-send-button composer-send-button--disabled"
                        : "composer-send-button"
                    }
                    type="button"
                    aria-label="Отправить"
                    onClick={() => {
                      void handleSendMessage();
                    }}
                  >
                    <ArrowUpIcon />
                  </button>
                </div>
              </div>
            </div>
          </footer>
        </main>

        <SettingsModal
          isOpen={isSettingsOpen}
          selectedTheme={selectedTheme}
          selectedChatSurface={selectedChatSurface}
          onClose={() => setIsSettingsOpen(false)}
          onSelectTheme={handleSelectTheme}
          onSelectChatSurface={handleSelectChatSurface}
        />
      </div>
    </div>
  );
}
