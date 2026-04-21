import { useEffect, useLayoutEffect, useRef, useState } from "react";

const sidebarThreads = [
  {
    id: "proxy",
    title: "Реализация proxy системы",
    subtitle: "Добавить поддержку HTTP_PROXY...",
    time: "2м назад",
    status: "orange",
    active: true,
  },
  {
    id: "mcp",
    title: "Настройка MCP серверов",
    subtitle: "Интеграция с Linear и GitHub...",
    time: "1ч назад",
    status: "green",
    active: false,
  },
];

const chatMessages = [
  {
    id: "user-1",
    type: "user",
    text: "Создай дизайн приложения-агента похожий на Codex App с синими акцентами",
    time: "14:30",
  },
  {
    id: "assistant-1",
    type: "assistant",
    text: [
      "Создаю современный дизайн приложения-агента с темной темой и синими акцентами. Основные компоненты:",
      "Левая боковая панель для проектов и чатов",
      "Центральная область для диалогов",
      "Композер для ввода сообщений",
      "Темная цветовая схема с синими акцентами (#3b82f6)",
    ],
    time: "14:31",
  },
  {
    id: "user-2",
    type: "user",
    text: "Сделай input более smooth и перенеси runtime-контролы внутрь нижней панели.",
    time: "14:33",
  },
  {
    id: "assistant-2",
    type: "assistant",
    text: [
      "Нижнюю панель перестраиваю в духе desktop-compose toolbar:",
      "слева quick actions и режим доступа",
      "справа модель, effort, context и круглая send-кнопка",
      "сам инпут делаю мягче и с большим радиусом",
    ],
    time: "14:34",
  },
  {
    id: "user-3",
    type: "user",
    text: "Покажи, как чат будет выглядеть в скролле, когда сообщений станет больше.",
    time: "14:36",
  },
  {
    id: "assistant-3",
    type: "assistant",
    text: [
      "Добавляю демонстрационный поток сообщений, чтобы центральная колонка ощущалась как реальная переписка, а не как статичный скрин.",
      "Скролл остаётся только у chat-area, composer закреплён внизу и всегда доступен.",
    ],
    time: "14:37",
  },
];

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

function FolderIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2.5 4.4h3.2l1.3 1.6h6.5v5.7c0 .8-.6 1.3-1.3 1.3H3.8c-.7 0-1.3-.5-1.3-1.3V5.7c0-.8.6-1.3 1.3-1.3Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
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

function SendIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M13.7 2.4 2.7 7.2l4.2 1.7 1.7 4.7 5.1-11.2Zm-6.8 6.5 6.2-6.2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
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

function ToggleSwitch({ checked }) {
  return (
    <span className={checked ? "toggle-switch toggle-switch--checked" : "toggle-switch"} aria-hidden="true">
      <span className="toggle-switch__thumb" />
    </span>
  );
}

function getSelectedLabel(options, selectedId) {
  return options.find((option) => option.id === selectedId)?.label ?? "";
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

function TreeThread({ thread }) {
  return (
    <article className={thread.active ? "thread-row thread-row--active" : "thread-row"}>
      <span className="thread-row__icon">
        <MessageIcon />
      </span>
      <div className="thread-row__content">
        <div className="thread-row__title">
          <strong>{thread.title}</strong>
          <span className={`presence-dot presence-dot--${thread.status}`} />
        </div>
        <span className="thread-row__time">{thread.time}</span>
      </div>
    </article>
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

function UserMessage({ text, time }) {
  return (
    <div className="chat-item chat-item--user">
      <div className="message-row">
        <div className="user-message-block">
          <div className="user-message">{text}</div>
          <MessageMeta time={time} align="right" />
        </div>

        <div className="avatar-badge">U</div>
      </div>
    </div>
  );
}

function AssistantMessage({ text, time }) {
  const [lead, ...rest] = text;

  return (
    <div className="chat-item chat-item--assistant">
      <article className="assistant-message">
        <p>{lead}</p>
        <ul>
          {rest.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </article>

      <MessageMeta time={time} />
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
  const [prompt, setPrompt] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [includeIdeContext, setIncludeIdeContext] = useState(true);
  const [planMode, setPlanMode] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState("default");
  const [selectedModel, setSelectedModel] = useState("gpt-5.4");
  const [selectedReasoning, setSelectedReasoning] = useState("high");
  const [selectedContinueMode, setSelectedContinueMode] = useState("local");
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

  useLayoutEffect(() => {
    resizeComposer(
      chatAreaRef.current,
      composerBoxRef.current,
      composerFooterRef.current,
      composerInputRef.current,
    );
  }, [prompt]);

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
  }, []);

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

  const selectedPermissionLabel = getSelectedLabel(permissionOptions, selectedPermission);
  const selectedModelLabel = getSelectedLabel(modelOptions, selectedModel);
  const selectedReasoningLabel = getSelectedLabel(reasoningOptions, selectedReasoning);

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

  return (
    <div className="app-root">
      <div className="window-caption">Дизайн приложения-агента</div>

      <div className="desktop-window">
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="sidebar-title-row">
              <h1>Codex Agent</h1>
              <button className="icon-button" type="button" aria-label="Настройки">
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
              <button className="tiny-icon-button" type="button" aria-label="Новый чат">
                <PlusIcon />
              </button>
            </div>

            <section className="tree-block">
              <div className="project-entry">
                <div className="project-entry__head">
                  <div className="project-entry__meta">
                    <span className="tree-icon tree-icon--small">
                      <ChevronDownIcon />
                    </span>
                    <div className="project-entry__text">
                      <strong>codex-agent</strong>
                      <p>~/code/codex-agent</p>
                    </div>
                  </div>
                  <span className="count-badge">3</span>
                </div>

                <div className="tree-children">
                  <section className="group-entry group-entry--expanded-last">
                    <div className="group-entry__head">
                      <span className="tree-icon tree-icon--small">
                        <ChevronDownIcon />
                      </span>
                      <span>Backend разработка</span>
                    </div>

                    <div className="group-entry__threads">
                      {sidebarThreads.map((thread) => (
                        <TreeThread key={thread.id} thread={thread} />
                      ))}
                    </div>
                  </section>

                  <section className="group-entry">
                    <div className="group-entry__head">
                      <span className="tree-icon tree-icon--small tree-icon--muted">
                        <ChevronRightIcon />
                      </span>
                      <span>Frontend дизайн</span>
                    </div>
                  </section>
                </div>
              </div>

              <div className="project-entry project-entry--collapsed">
                <div className="project-entry__head">
                  <div className="project-entry__meta">
                    <span className="tree-icon tree-icon--small tree-icon--muted">
                      <ChevronRightIcon />
                    </span>
                    <div className="project-entry__text">
                      <strong>web-app</strong>
                      <p>~/projects/web-app</p>
                    </div>
                  </div>
                  <span className="count-badge">1</span>
                </div>
              </div>
            </section>
          </div>
        </aside>

        <main className="chat-area" ref={chatAreaRef}>
          <section className="chat-content" ref={chatContentRef}>
            {chatMessages.map((message) =>
              message.type === "user" ? (
                <UserMessage key={message.id} text={message.text} time={message.time} />
              ) : (
                <AssistantMessage key={message.id} text={message.text} time={message.time} />
              ),
            )}
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
                placeholder="Спросите у агента что-нибудь..."
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
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

                  <button className="composer-send-button" type="button" aria-label="Отправить">
                    <ArrowUpIcon />
                  </button>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
