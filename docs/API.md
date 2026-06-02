# BizStruct API — Специфікація

> Документація описує всі ендпоїнти, які фронтенд очікує від бекенду, та точні структури даних.

---

## Зміст

1. [Загальне](#загальне)
2. [Проєкти](#проєкти)
   - [GET /api/projects](#get-apiprojects)
   - [GET /api/projects/history](#get-apiprojectshistory)
3. [Генерація проєкту](#генерація-проєкту)
   - [POST /api/generation](#post-apigeneration)
4. [Canvas (Бізнес-модель)](#canvas-бізнес-модель)
   - [GET /api/canvas/:projectId](#get-apicanvasprojectid)
5. [Empathy Map](#empathy-map)
   - [GET /api/empathy-map/:projectId](#get-apiempathy-mapprojectid)
6. [Hypotheses (Гіпотези)](#hypotheses-гіпотези)
   - [GET /api/hypotheses/:projectId](#get-apihypothesesprojectid)
7. [Pitch (Пітч)](#pitch-пітч)
   - [GET /api/pitch/:projectId](#get-apipitchprojectid)
8. [Scenario (Сценарій)](#scenario-сценарій)
   - [GET /api/scenario/:projectId](#get-apiscenarioprojectid)
9. [What-If (Стратегічні вектори)](#what-if-стратегічні-вектори)
   - [GET /api/what-if/:projectId](#get-apiwhat-ifprojectid)
10. [Architecture (Архітектура)](#architecture-архітектура)
    - [GET /api/architecture/:projectId](#get-apiarchitectureprojectid)
11. [Типи та схеми](#типи-та-схеми)

---

## Загальне

**Base URL:** `/api`

**Заголовки запиту:**
```
Content-Type: application/json
```

**Параметр локалізації:**
Ендпоїнти, що повертають текстовий контент, приймають query-параметр:
```
?locale=uk   # українська (default)
?locale=en   # англійська
```

**Формат помилки:**
```json
{
  "error": "Опис помилки"
}
```

---

## Проєкти

### GET /api/projects

Повертає список активних проєктів користувача.

**Параметри:** відсутні

**Відповідь `200`:**
```json
[
  {
    "id": "string",
    "translationKey": "ecoSync" | "smartGrid" | "carbonTrack" | "bioWaste"
  }
]
```

| Поле | Тип | Опис |
|------|-----|------|
| `id` | `string` | Унікальний ідентифікатор проєкту |
| `translationKey` | `enum` | Ключ для i18n локалізації назви проєкту |

---

### GET /api/projects/history

Повертає список проєктів з історії (архів).

**Параметри:** відсутні

**Відповідь `200`:**
```json
[
  {
    "id": "string",
    "title": "string",
    "translationKey": "ecoSync" | "greenLogistics" | "carbonTrack" | "agroEsg",
    "empathy": {
      "pains": ["string"],
      "gains": ["string"]
    }
  }
]
```

| Поле | Тип | Обов'язкове | Опис |
|------|-----|-------------|------|
| `id` | `string` | так | Унікальний ідентифікатор |
| `title` | `string` | так | Назва проєкту |
| `translationKey` | `enum` | ні | Ключ локалізації (якщо є переклад) |
| `empathy.pains` | `string[]` | ні | Список болей клієнта |
| `empathy.gains` | `string[]` | ні | Список вигод клієнта |

---

## Генерація проєкту

### POST /api/generation

Генерує бізнес-моделі на основі ідеї користувача. Це єдиний ендпоїнт, що приймає тіло запиту.

**Тіло запиту:**
```json
{
  "idea": "string"
}
```

| Поле | Тип | Валідація |
|------|-----|-----------|
| `idea` | `string` | мінімум 10 символів |

**Відповідь `200` (успіх):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "idea": "string",
    "models": [
      {
        "id": "string",
        "title": "string",
        "audience": "string",
        "valueProposition": "string",
        "description": "string"
      }
    ]
  }
}
```

**Відповідь `400` (помилка валідації):**
```json
{
  "success": false,
  "error": "Опишіть ідею детальніше (мінімум 10 символів)"
}
```

| Поле | Тип | Опис |
|------|-----|------|
| `data.id` | `string` | ID створеного проєкту |
| `data.title` | `string` | Згенерована назва проєкту |
| `data.idea` | `string` | Оригінальна ідея |
| `data.models[]` | `GeneratedBusinessModel[]` | Варіанти бізнес-моделей |
| `data.models[].id` | `string` | ID моделі |
| `data.models[].title` | `string` | Назва моделі |
| `data.models[].audience` | `string` | Цільова аудиторія |
| `data.models[].valueProposition` | `string` | Ціннісна пропозиція |
| `data.models[].description` | `string` | Опис моделі |

---

## Canvas (Бізнес-модель)

### GET /api/canvas/:projectId

Повертає дані Business Model Canvas для проєкту.

**Path params:** `projectId: string`

**Відповідь `200`:**
```json
{
  "keyPartners": [{ "id": "string", "text": "string", "isAiGenerated": true, "subtext": "string" }],
  "keyActivities": [{ "id": "string", "text": "string", "isAiGenerated": false }],
  "keyResources": [...],
  "valuePropositions": [...],
  "customerRelationships": [...],
  "channels": [...],
  "customerSegments": [...],
  "costStructure": [...],
  "revenueStreams": [...]
}
```

**Структура `CanvasCard`:**

| Поле | Тип | Обов'язкове | Опис |
|------|-----|-------------|------|
| `id` | `string` | так | Унікальний ідентифікатор картки |
| `text` | `string` | так | Текст картки |
| `isAiGenerated` | `boolean` | так | Чи згенерована AI |
| `subtext` | `string` | ні | Додатковий підтекст |

**Секції Canvas:**

| Ключ | Назва блоку |
|------|-------------|
| `keyPartners` | Ключові партнери |
| `keyActivities` | Ключові активності |
| `keyResources` | Ключові ресурси |
| `valuePropositions` | Ціннісні пропозиції |
| `customerRelationships` | Відносини з клієнтами |
| `channels` | Канали |
| `customerSegments` | Сегменти клієнтів |
| `costStructure` | Структура витрат |
| `revenueStreams` | Потоки доходів |

---

## Empathy Map

### GET /api/empathy-map/:projectId

Повертає дані Empathy Map для проєкту.

**Path params:** `projectId: string`
**Query params:** `locale?: "uk" | "en"`

**Відповідь `200`:**
```json
{
  "says": [{ "id": 1, "text": "string" }],
  "thinks": [{ "id": 2, "text": "string" }],
  "does": [{ "id": 3, "text": "string" }],
  "feels": [{ "id": 4, "text": "string" }],
  "pains": [{ "id": 5, "text": "string" }],
  "gains": [{ "id": 6, "text": "string" }]
}
```

**Структура `EmpathyItem`:**

| Поле | Тип | Опис |
|------|-----|------|
| `id` | `number` | Унікальний числовий ID |
| `text` | `string` | Текст (локалізований відповідно до `locale`) |

**Категорії:**

| Ключ | Значення |
|------|----------|
| `says` | Що говорить клієнт |
| `thinks` | Що думає клієнт |
| `does` | Що робить клієнт |
| `feels` | Що відчуває клієнт |
| `pains` | Болі клієнта |
| `gains` | Вигоди клієнта |

---

## Hypotheses (Гіпотези)

### GET /api/hypotheses/:projectId

Повертає список бізнес-гіпотез проєкту.

**Path params:** `projectId: string`

**Відповідь `200`:**
```json
[
  {
    "id": "string",
    "text": "string",
    "category": "Desirability" | "Viability" | "Feasibility",
    "quadrant": "q1" | "q2" | "q3" | "q4"
  }
]
```

| Поле | Тип | Опис |
|------|-----|------|
| `id` | `string` | Унікальний ідентифікатор |
| `text` | `string` | Текст гіпотези |
| `category` | `enum` | Категорія гіпотези |
| `quadrant` | `enum` | Квадрант матриці ризиків |

**Категорії (`category`):**

| Значення | Опис |
|----------|------|
| `Desirability` | Бажаність — чи потрібне це ринку |
| `Viability` | Доцільність — чи це бізнес-модель |
| `Feasibility` | Здійсненність — чи можна це реалізувати |

**Квадранти (`quadrant`):**

| Значення | Опис |
|----------|------|
| `q1` | Верхній лівий |
| `q2` | Верхній правий |
| `q3` | Нижній лівий |
| `q4` | Нижній правий |

---

## Pitch (Пітч)

### GET /api/pitch/:projectId

Повертає структуру пітчу для двох аудиторій.

**Path params:** `projectId: string`
**Query params:** `locale?: "uk" | "en"`

**Відповідь `200`:**
```json
{
  "investor": [
    { "id": 1, "titleKey": "string", "content": "string" }
  ],
  "customer": [
    { "id": 2, "titleKey": "string", "content": "string" }
  ]
}
```

**Структура `PitchStep`:**

| Поле | Тип | Опис |
|------|-----|------|
| `id` | `number` | Порядковий номер кроку |
| `titleKey` | `string` | i18n-ключ заголовку слайду |
| `content` | `string` | Текст контенту (локалізований) |

**Типи пітчів:**

| Ключ | Аудиторія |
|------|-----------|
| `investor` | Пітч для інвестора |
| `customer` | Пітч для клієнта |

---

## Scenario (Сценарій)

### GET /api/scenario/:projectId

Повертає сценарій використання продукту через персону.

**Path params:** `projectId: string`
**Query params:** `locale?: "uk" | "en"`

**Відповідь `200`:**
```json
{
  "persona": {
    "name": "string",
    "initials": "string",
    "role": "string",
    "painPoint": "string"
  },
  "timeline": [
    {
      "iconKey": "clock" | "target" | "sparkles",
      "labelKey": "string",
      "text": "string",
      "highlight": true
    }
  ],
  "metrics": {
    "before": { "value": "string", "descriptionKey": "string" },
    "after": { "value": "string", "descriptionKey": "string" }
  }
}
```

**Структура `Persona`:**

| Поле | Тип | Опис |
|------|-----|------|
| `name` | `string` | Ім'я персони |
| `initials` | `string` | Ініціали (напр. `"АМ"`) |
| `role` | `string` | Посада / роль |
| `painPoint` | `string` | Основний біль персони |

**Структура `TimelineStep`:**

| Поле | Тип | Обов'язкове | Опис |
|------|-----|-------------|------|
| `iconKey` | `enum` | так | Іконка кроку (`clock`, `target`, `sparkles`) |
| `labelKey` | `string` | так | i18n-ключ мітки |
| `text` | `string` | так | Опис кроку (локалізований) |
| `highlight` | `boolean` | ні | Виділений крок |

**Структура `ScenarioMetrics`:**

| Поле | Тип | Опис |
|------|-----|------|
| `before.value` | `string` | Значення до впровадження |
| `before.descriptionKey` | `string` | i18n-ключ опису |
| `after.value` | `string` | Значення після впровадження |
| `after.descriptionKey` | `string` | i18n-ключ опису |

---

## What-If (Стратегічні вектори)

### GET /api/what-if/:projectId

Повертає стратегічні вектори ризиків та можливостей.

**Path params:** `projectId: string`

**Відповідь `200`:**
```json
[
  {
    "id": "financial" | "technical" | "emotional",
    "badgeKey": "string",
    "titleKey": "string",
    "promptKey": "string",
    "accentClass": "string",
    "borderClass": "string",
    "iconKey": "coins" | "cpu" | "heartHandshake",
    "blocks": [
      { "labelKey": "string", "text": "string" }
    ]
  }
]
```

**Структура `WhatIfVector`:**

| Поле | Тип | Опис |
|------|-----|------|
| `id` | `enum` | Ідентифікатор вектора |
| `badgeKey` | `string` | i18n-ключ бейджа |
| `titleKey` | `string` | i18n-ключ заголовку |
| `promptKey` | `string` | i18n-ключ питання-підказки |
| `accentClass` | `string` | CSS-клас акцентного кольору |
| `borderClass` | `string` | CSS-клас кольору бордера |
| `iconKey` | `enum` | Ідентифікатор іконки |
| `blocks` | `WhatIfBlock[]` | Блоки контенту |

**Структура `WhatIfBlock`:**

| Поле | Тип | Опис |
|------|-----|------|
| `labelKey` | `string` | i18n-ключ мітки блоку |
| `text` | `string` | Текст блоку |

**Вектори (`id`):**

| Значення | Опис |
|----------|------|
| `financial` | Фінансовий вектор |
| `technical` | Технічний вектор |
| `emotional` | Емоційний вектор |

---

## Architecture (Архітектура)

### GET /api/architecture/:projectId

Повертає оригінальну та регенеровану архітектуру бізнес-моделі.

**Path params:** `projectId: string`
**Query params:** `locale?: "uk" | "en"`

**Відповідь `200`:**
```json
{
  "original": {
    "epicenter": { "titleKey": "string", "description": "string" },
    "pattern": { "titleKey": "string", "description": "string" }
  },
  "regenerated": {
    "epicenter": { "titleKey": "string", "description": "string" },
    "pattern": { "titleKey": "string", "description": "string" }
  }
}
```

**Структура `ArchitectureCard`:**

| Поле | Тип | Опис |
|------|-----|------|
| `titleKey` | `string` | i18n-ключ заголовку |
| `description` | `string` | Опис (локалізований) |

**Варіанти (`variant`):**

| Ключ | Опис |
|------|------|
| `original` | Оригінальна архітектура |
| `regenerated` | Регенерована AI архітектура |

---

## Типи та схеми

Всі типи валідуються через [Zod](https://zod.dev/) схеми у [src/schemas/](../src/schemas/).

| Файл | Типи |
|------|------|
| [project.schema.ts](../src/schemas/project.schema.ts) | `Project`, `HistoryItem`, `GeneratedProject`, `GeneratedBusinessModel` |
| [canvas.schema.ts](../src/schemas/canvas.schema.ts) | `CanvasCard`, `CanvasSections`, `CanvasSectionKey` |
| [empathy-map.schema.ts](../src/schemas/empathy-map.schema.ts) | `EmpathyItem`, `EmpathyData`, `EmpathyCategory` |
| [hypotheses.schema.ts](../src/schemas/hypotheses.schema.ts) | `Hypothesis`, `HypothesisCategory`, `HypothesisQuadrant` |
| [pitch.schema.ts](../src/schemas/pitch.schema.ts) | `PitchStep`, `PitchData`, `StoryType` |
| [scenario.schema.ts](../src/schemas/scenario.schema.ts) | `Persona`, `TimelineStep`, `ScenarioMetrics`, `ScenarioData` |
| [what-if.schema.ts](../src/schemas/what-if.schema.ts) | `WhatIfVector`, `WhatIfBlock`, `WhatIfVectorId` |
| [architecture.schema.ts](../src/schemas/architecture.schema.ts) | `ArchitectureCard`, `ArchitectureData`, `ArchitectureVariant` |

---

## Зведена таблиця ендпоїнтів

| Метод | Ендпоїнт | Локаль | Опис |
|-------|----------|--------|------|
| `GET` | `/api/projects` | — | Активні проєкти |
| `GET` | `/api/projects/history` | — | Архів проєктів |
| `POST` | `/api/generation` | — | Генерація бізнес-моделей з ідеї |
| `GET` | `/api/canvas/:projectId` | — | Business Model Canvas |
| `GET` | `/api/empathy-map/:projectId` | так | Empathy Map |
| `GET` | `/api/hypotheses/:projectId` | — | Гіпотези |
| `GET` | `/api/pitch/:projectId` | так | Пітч (інвестор / клієнт) |
| `GET` | `/api/scenario/:projectId` | так | Сценарій використання |
| `GET` | `/api/what-if/:projectId` | — | Стратегічні вектори |
| `GET` | `/api/architecture/:projectId` | так | Архітектура бізнес-моделі |
