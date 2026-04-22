import { startTransition, useEffect, useLayoutEffect, useRef, useState } from "react";

const MINUTE = 60 * 1000;
const MAX_THREAD_TITLE_LENGTH = 48;
const runtimeNow = Date.now();

const initialFolders = [
  {
    id: "root-codex",
    kind: "root",
    name: "codex-agent",
    displayPath: "~/code/codex-agent",
    parentId: null,
    expanded: true,
    order: 0,
    source: "demo",
  },
  {
    id: "folder-backend",
    kind: "folder",
    name: "Backend разработка",
    parentId: "root-codex",
    expanded: true,
    order: 0,
    source: "demo",
  },
  {
    id: "folder-auth-gateway",
    kind: "folder",
    name: "Auth gateway",
    parentId: "folder-backend",
    expanded: true,
    order: 1,
    source: "demo",
  },
  {
    id: "folder-release-audit",
    kind: "folder",
    name: "Release audit",
    parentId: "folder-backend",
    expanded: true,
    order: 2,
    source: "demo",
  },
  {
    id: "folder-frontend",
    kind: "folder",
    name: "Frontend дизайн",
    parentId: "root-codex",
    expanded: true,
    order: 3,
    source: "demo",
  },
  {
    id: "root-web",
    kind: "root",
    name: "web-app",
    displayPath: "~/projects/web-app",
    parentId: null,
    expanded: true,
    order: 1,
    source: "demo",
  },
  {
    id: "folder-checkout",
    kind: "folder",
    name: "Checkout flows",
    parentId: "root-web",
    expanded: true,
    order: 0,
    source: "demo",
  },
  {
    id: "folder-analytics",
    kind: "folder",
    name: "Analytics",
    parentId: "root-web",
    expanded: false,
    order: 1,
    source: "demo",
  },
  {
    id: "root-partner",
    kind: "root",
    name: "partner-portal",
    displayPath: "~/workspace/partner-portal",
    parentId: null,
    expanded: false,
    order: 2,
    source: "demo",
  },
  {
    id: "folder-onboarding",
    kind: "folder",
    name: "Onboarding",
    parentId: "root-partner",
    expanded: false,
    order: 0,
    source: "demo",
  },
];

const initialThreads = [
  {
    id: "thread-proxy",
    folderId: "folder-backend",
    title: "Реализация proxy системы",
    status: "orange",
    favorite: false,
    updatedAt: runtimeNow - 2 * MINUTE,
    messages: [
      {
        id: "thread-proxy-user-1",
        role: "user",
        content: "Создай дизайн приложения-агента похожий на Codex App с синими акцентами",
        createdAt: runtimeNow - 30 * MINUTE,
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
        createdAt: runtimeNow - 29 * MINUTE,
      },
      {
        id: "thread-proxy-user-2",
        role: "user",
        content: "Сделай input более smooth и перенеси runtime-контролы внутрь нижней панели.",
        createdAt: runtimeNow - 27 * MINUTE,
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
        createdAt: runtimeNow - 26 * MINUTE,
      },
      {
        id: "thread-proxy-user-3",
        role: "user",
        content: "Покажи, как чат будет выглядеть в скролле, когда сообщений станет больше.",
        createdAt: runtimeNow - 24 * MINUTE,
      },
      {
        id: "thread-proxy-assistant-3",
        role: "assistant",
        content: [
          "Добавляю демонстрационный поток сообщений, чтобы центральная колонка ощущалась как реальная переписка, а не как статичный скрин.",
          "Скролл остаётся только у chat-area, composer закреплён внизу и всегда доступен.",
        ],
        createdAt: runtimeNow - 23 * MINUTE,
      },
    ],
  },
  {
    id: "thread-mcp",
    folderId: "folder-backend",
    title: "Настройка MCP серверов",
    status: "green",
    favorite: false,
    updatedAt: runtimeNow - 65 * MINUTE,
    messages: [
      {
        id: "thread-mcp-user-1",
        role: "user",
        content: "Собери MCP конфиг для Linear и GitHub, чтобы он был безопасен для прототипа.",
        createdAt: runtimeNow - 96 * MINUTE,
      },
      {
        id: "thread-mcp-assistant-1",
        role: "assistant",
        content: [
          "Подготовил безопасный минимальный состав MCP-подключений для демо.",
          "Linear и GitHub вынесены в отдельные подключения с явными зонами ответственности.",
          "UI в прототипе может показывать их как разные контексты проекта.",
        ],
        createdAt: runtimeNow - 95 * MINUTE,
      },
    ],
  },
  {
    id: "thread-auth",
    folderId: "folder-auth-gateway",
    title: "Ротация service token",
    status: "green",
    favorite: true,
    updatedAt: runtimeNow - 18 * MINUTE,
    messages: [
      {
        id: "thread-auth-user-1",
        role: "user",
        content: "Разбей ротацию сервисного токена на безопасные шаги без downtime.",
        createdAt: runtimeNow - 54 * MINUTE,
      },
      {
        id: "thread-auth-assistant-1",
        role: "assistant",
        content: [
          "Разложил миграцию на две фазы: выпуск нового секрета и мягкое переключение клиентов.",
          "Параллельно держим старый токен валидным, пока метрики не покажут полное переключение.",
        ],
        createdAt: runtimeNow - 53 * MINUTE,
      },
    ],
  },
  {
    id: "thread-release",
    folderId: "folder-release-audit",
    title: "Ревью регресса релиза",
    status: "orange",
    favorite: false,
    updatedAt: runtimeNow - 42 * MINUTE,
    messages: [
      {
        id: "thread-release-user-1",
        role: "user",
        content: "Собери короткий список блокеров перед вечерним релизом.",
        createdAt: runtimeNow - 82 * MINUTE,
      },
      {
        id: "thread-release-assistant-1",
        role: "assistant",
        content: [
          "Собрал pre-release список и разбил риски на блокеры и деградации.",
          "Главный фокус: сеть, миграции конфигурации и откат на stage-stand.",
        ],
        createdAt: runtimeNow - 80 * MINUTE,
      },
    ],
  },
  {
    id: "thread-landing",
    folderId: "folder-frontend",
    title: "Редизайн hero-блока",
    status: "green",
    favorite: false,
    updatedAt: runtimeNow - 155 * MINUTE,
    messages: [
      {
        id: "thread-landing-user-1",
        role: "user",
        content: "Сделай hero более дорогим по ощущению, без перегруза.",
        createdAt: runtimeNow - 188 * MINUTE,
      },
      {
        id: "thread-landing-assistant-1",
        role: "assistant",
        content: [
          "Сместил акцент в типографику и воздух, вместо тяжёлых карточек.",
          "Главное впечатление теперь создают контраст, ритм и большие смысловые паузы.",
        ],
        createdAt: runtimeNow - 186 * MINUTE,
      },
    ],
  },
  {
    id: "thread-hydration",
    folderId: "root-web",
    title: "SSR hydration fixes",
    status: "green",
    favorite: true,
    updatedAt: runtimeNow - 14 * MINUTE,
    messages: [
      {
        id: "thread-hydration-user-1",
        role: "user",
        content: "Поймай причины hydration mismatch в web-app и предложи безопасный фикс.",
        createdAt: runtimeNow - 38 * MINUTE,
      },
      {
        id: "thread-hydration-assistant-1",
        role: "assistant",
        content: [
          "Сузил mismatch до client-only timestamps и условного рендера виджета.",
          "Для прототипа хватит стабильного SSR значения и отложенного client patch после mount.",
        ],
        createdAt: runtimeNow - 37 * MINUTE,
      },
    ],
  },
  {
    id: "thread-checkout",
    folderId: "folder-checkout",
    title: "Брошенные корзины",
    status: "orange",
    favorite: false,
    updatedAt: runtimeNow - 205 * MINUTE,
    messages: [
      {
        id: "thread-checkout-user-1",
        role: "user",
        content: "Покажи, как лучше восстанавливать checkout после refresh.",
        createdAt: runtimeNow - 235 * MINUTE,
      },
      {
        id: "thread-checkout-assistant-1",
        role: "assistant",
        content: [
          "Для UX лучше сохранять восстановимый шаг и корзину, но не transient UI state.",
          "Переоткрытие checkout должно возвращать пользователя на ближайший валидный шаг.",
        ],
        createdAt: runtimeNow - 232 * MINUTE,
      },
    ],
  },
  {
    id: "thread-analytics",
    folderId: "folder-analytics",
    title: "События воронки",
    status: "green",
    favorite: false,
    updatedAt: runtimeNow - 360 * MINUTE,
    messages: [
      {
        id: "thread-analytics-user-1",
        role: "user",
        content: "Собери новую воронку по checkout и drop-off.",
        createdAt: runtimeNow - 420 * MINUTE,
      },
      {
        id: "thread-analytics-assistant-1",
        role: "assistant",
        content: [
          "Разделил funnel на переходы по шагам, отмены и возвраты после ошибки.",
          "В таком виде панель аналитики легче сопоставить с живым UI checkout.",
        ],
        createdAt: runtimeNow - 418 * MINUTE,
      },
    ],
  },
  {
    id: "thread-onboarding",
    folderId: "folder-onboarding",
    title: "Первый run для партнёра",
    status: "green",
    favorite: false,
    updatedAt: runtimeNow - 510 * MINUTE,
    messages: [
      {
        id: "thread-onboarding-user-1",
        role: "user",
        content: "Подготовь сценарий первого запуска для нового партнёрского кабинета.",
        createdAt: runtimeNow - 545 * MINUTE,
      },
      {
        id: "thread-onboarding-assistant-1",
        role: "assistant",
        content: [
          "Сценарий разбит на импорт данных, привязку ролей и первую проверку доступов.",
          "Для прототипа это хороший пример отдельной корневой папки с собственной структурой.",
        ],
        createdAt: runtimeNow - 540 * MINUTE,
      },
    ],
  },
];

const initialFolderDrafts = {
  "folder:folder-release-audit": "Собери список рисков перед вечерним релизом и отдельно выдели блокеры.",
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
    description: "Теплый песочный акцент для bubble и composer, как на референсе.",
    swatches: ["#231f1b", "#c6b7a6", "#8d7b6b"],
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

function countDirectThreads(folderId, threads) {
  return threads.filter((thread) => thread.folderId === folderId).length;
}

function countThreadsInFolderTree(folderId, folders, threads) {
  let total = 0;
  const queue = [folderId];

  while (queue.length > 0) {
    const currentFolderId = queue.shift();
    total += threads.filter((thread) => thread.folderId === currentFolderId).length;

    folders.forEach((folder) => {
      if (folder.parentId === currentFolderId) {
        queue.push(folder.id);
      }
    });
  }

  return total;
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
        d="M6.7 1.9h2.6l.4 1.6c.3.1.6.2.9.4l1.5-.8 1.3 1.9-1.2 1c.1.3.1.6.1.9s0 .6-.1.9l1.2 1-1.3 1.9-1.5-.8c-.3.2-.6.3-.9.4l-.4 1.6H6.7l-.4-1.6c-.3-.1-.6-.2-.9-.4l-1.5.8-1.3-1.9 1.2-1A3.8 3.8 0 0 1 3.7 8c0-.3 0-.6.1-.9l-1.2-1 1.3-1.9 1.5.8c.3-.2.6-.3.9-.4l.4-1.6Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.15"
      />
      <circle cx="8" cy="8" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.15" />
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

function StarIcon({ filled = false }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="m8 2.3 1.5 3.1 3.4.5-2.5 2.4.6 3.4L8 10.1l-3 1.6.6-3.4L3 5.9l3.4-.5L8 2.3Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.15"
      />
    </svg>
  );
}

function MessagePlusIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.4 3.2h9.2c.8 0 1.4.6 1.4 1.4v5.4c0 .8-.6 1.4-1.4 1.4H7l-2.6 2v-2H3.4c-.8 0-1.4-.6-1.4-1.4V4.6c0-.8.6-1.4 1.4-1.4Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      <path
        d="M8 5.2v3.6M6.2 7h3.6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
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

function ThreadRow({ thread, isActive, onSelect, onToggleFavorite }) {
  return (
    <article
      className={isActive ? "thread-row thread-row--active" : "thread-row"}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={getKeyActionHandler(onSelect)}
    >
      <span className="thread-row__icon">
        <MessageIcon />
      </span>

      <div className="thread-row__content">
        <div className="thread-row__title">
          <strong>{thread.title}</strong>
          <button
            className={thread.favorite ? "thread-row__favorite thread-row__favorite--active" : "thread-row__favorite"}
            type="button"
            aria-label={thread.favorite ? "Убрать из избранного" : "Добавить в избранное"}
            aria-pressed={thread.favorite}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite();
            }}
          >
            <StarIcon filled={thread.favorite} />
          </button>
        </div>

        <div className="thread-row__meta">
          <span className="thread-row__time">{formatRelativeTime(thread.updatedAt)}</span>
          <span className={`presence-dot presence-dot--${thread.status}`} />
        </div>
      </div>
    </article>
  );
}

function FolderTree({
  folder,
  folders,
  threads,
  activeThreadId,
  displayPath,
  renderAsRoot,
  onToggleExpanded,
  onOpenDraft,
  onSelectThread,
  onToggleFavorite,
}) {
  const directThreads = sortThreadsForFolder(threads, folder.id);
  const childFolders = sortFoldersForParent(folders, folder.id);
  const totalThreads = countThreadsInFolderTree(folder.id, folders, threads);
  const isRoot = renderAsRoot;
  const toggleFolder = () => onToggleExpanded(folder.id);
  const openDraft = () => onOpenDraft(folder.id);

  return (
    <section className={isRoot ? "project-entry" : "folder-row"}>
      <div
        className={isRoot ? "project-entry__head project-entry__head--interactive" : "folder-row__head"}
        role="button"
        tabIndex={0}
        onClick={toggleFolder}
        onKeyDown={getKeyActionHandler(toggleFolder)}
      >
        {isRoot ? (
          <>
            <div className="project-entry__meta">
              <span className="tree-icon tree-icon--small">
                {folder.expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </span>
              <div className="project-entry__text">
                <strong>{folder.name}</strong>
                <p>{displayPath ?? buildFolderDisplayPath(folder.id, folders)}</p>
              </div>
            </div>

            <div className="project-entry__actions">
              <button
                className="folder-quick-button folder-quick-button--root"
                type="button"
                aria-label={`Создать чат в папке ${folder.name}`}
                onClick={(event) => {
                  event.stopPropagation();
                  openDraft();
                }}
              >
                <MessagePlusIcon />
              </button>

              <span className="count-badge">{totalThreads}</span>
            </div>
          </>
        ) : (
          <>
            <div className="folder-row__title-wrap">
              <span className="tree-icon tree-icon--small">
                {folder.expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </span>
              <span className="folder-row__title">{folder.name}</span>
            </div>

            <div className="folder-row__actions">
              <button
                className="folder-quick-button"
                type="button"
                aria-label={`Создать чат в папке ${folder.name}`}
                onClick={(event) => {
                  event.stopPropagation();
                  openDraft();
                }}
              >
                <MessagePlusIcon />
              </button>
            </div>
          </>
        )}
      </div>

      {folder.expanded ? (
        <div className={isRoot ? "folder-children folder-children--root" : "folder-children"}>
          {directThreads.map((thread) => (
            <ThreadRow
              key={thread.id}
              thread={thread}
              isActive={thread.id === activeThreadId}
              onSelect={() => onSelectThread(thread.id)}
              onToggleFavorite={() => onToggleFavorite(thread.id)}
            />
          ))}

          {childFolders.map((childFolder) => (
            <FolderTree
              key={childFolder.id}
              folder={childFolder}
              folders={folders}
              threads={threads}
              activeThreadId={activeThreadId}
              displayPath={null}
              renderAsRoot={false}
              onToggleExpanded={onToggleExpanded}
              onOpenDraft={onOpenDraft}
              onSelectThread={onSelectThread}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function MessageMeta({ time, align = "left" }) {
  return (
    <div className={align === "right" ? "message-meta message-meta--right" : "message-meta"}>
      <span className={align === "right" ? "message-time message-time--right" : "message-time"}>
        {time}
        <span className="message-actions" aria-hidden="true">
          <button className="message-action-button" type="button" aria-label="Копировать">
            <CopyIcon />
          </button>
          <button className="message-action-button" type="button" aria-label="Ответвить">
            <BranchIcon />
          </button>
        </span>
      </span>
    </div>
  );
}

function UserMessage({ content, time }) {
  return (
    <div className="chat-item chat-item--user">
      <div className="message-row">
        <div className="user-message-block">
          <div className="user-message">{content}</div>
          <MessageMeta time={time} align="right" />
        </div>

        <div className="avatar-badge">U</div>
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

function SettingsModal({ isOpen, selectedTheme, onClose, onSelectTheme }) {
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
              <p className="settings-modal__description">
                Базовые настройки интерфейса прототипа. Пока здесь только смена темы.
              </p>
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

function resizeComposer(chatArea, composerBox, composerFooter, composerInput) {
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

  const composerReservedSpace = composerBox.offsetHeight + 22;
  chatArea.style.setProperty("--composer-reserved-space", `${composerReservedSpace}px`);
}

export default function App() {
  const [folders, setFolders] = useState(() => initialFolders);
  const [threads, setThreads] = useState(() => initialThreads);
  const [threadDrafts, setThreadDrafts] = useState(() => ({}));
  const [folderDrafts, setFolderDrafts] = useState(() => initialFolderDrafts);
  const [pendingFolderTargets, setPendingFolderTargets] = useState(() => []);
  const [activePane, setActivePane] = useState(() => ({ type: "thread", threadId: "thread-proxy" }));
  const [openMenu, setOpenMenu] = useState(null);
  const [includeIdeContext, setIncludeIdeContext] = useState(true);
  const [planMode, setPlanMode] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState("default");
  const [selectedModel, setSelectedModel] = useState("gpt-5.4");
  const [selectedReasoning, setSelectedReasoning] = useState("high");
  const [selectedContinueMode, setSelectedContinueMode] = useState("local");
  const [selectedTheme, setSelectedTheme] = useState("grey");
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

  const rootFolders = sortFoldersForParent(folders, null);
  const visibleSidebarRoots = rootFolders.map((rootFolder) => {
    const visibleFolderId = getTopLevelVisibleFolderId(rootFolder.id, folders, threads);
    const visibleFolder = getFolderById(folders, visibleFolderId) ?? rootFolder;

    return {
      id: rootFolder.id,
      folder: visibleFolder,
      displayPath: buildFolderDisplayPath(visibleFolder.id, folders),
    };
  });
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
  const selectedModelLabel = getSelectedLabel(modelOptions, selectedModel);
  const selectedReasoningLabel = getSelectedLabel(reasoningOptions, selectedReasoning);

  useLayoutEffect(() => {
    resizeComposer(
      chatAreaRef.current,
      composerBoxRef.current,
      composerFooterRef.current,
      composerInputRef.current,
    );
  }, [activeComposerText]);

  useLayoutEffect(() => {
    const chatArea = chatAreaRef.current;

    if (!chatArea) {
      return undefined;
    }

    const handleResize = () =>
      resizeComposer(
        chatAreaRef.current,
        composerBoxRef.current,
        composerFooterRef.current,
        composerInputRef.current,
      );

    handleResize();

    const observer = new ResizeObserver(handleResize);
    observer.observe(chatArea);
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const handleSelectTheme = (themeId) => {
    if (themeId === selectedTheme) {
      return;
    }

    startTransition(() => {
      setSelectedTheme(themeId);
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

  return (
    <div className="app-root" data-theme={selectedTheme}>
      <div className="window-caption">Дизайн приложения-агента</div>

      <div className="desktop-window">
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
              <span className="search-field__placeholder">Поиск...</span>
            </label>
          </div>

          <div className="sidebar-body">
            <div className="sidebar-section-label sidebar-section-label--tight">
              <span>Новый чат</span>
              <button
                className="tiny-icon-button"
                type="button"
                aria-label="Новый чат"
                disabled={!isDirectoryPickerAvailable}
                onClick={() => {
                  void handleOpenFolderPicker();
                }}
              >
                <PlusIcon />
              </button>
            </div>

            <section className="tree-block">
              {visibleSidebarRoots.map((entry) => (
                <FolderTree
                  key={entry.id}
                  folder={entry.folder}
                  folders={folders}
                  threads={threads}
                  activeThreadId={activeThread?.id ?? null}
                  displayPath={entry.displayPath}
                  renderAsRoot
                  onToggleExpanded={handleToggleExpanded}
                  onOpenDraft={openDraftForFolder}
                  onSelectThread={handleSelectThread}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </section>
          </div>
        </aside>

        <main className="chat-area" ref={chatAreaRef}>
          <section
            className={activePane.type === "draft" ? "chat-content chat-content--canvas" : "chat-content"}
            ref={chatContentRef}
          >
            {activePane.type === "thread" && activeThread
              ? activeThreadMessages.map((message) =>
                  message.role === "user" ? (
                    <UserMessage
                      key={message.id}
                      content={message.content}
                      time={formatChatTime(message.createdAt)}
                    />
                  ) : (
                    <AssistantMessage
                      key={message.id}
                      content={message.content}
                      time={formatChatTime(message.createdAt)}
                    />
                  ),
                )
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
                </div>

                <div className="composer-footer__right">
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
          onClose={() => setIsSettingsOpen(false)}
          onSelectTheme={handleSelectTheme}
        />
      </div>
    </div>
  );
}
