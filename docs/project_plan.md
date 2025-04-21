# 🧠 Project: PromptBuilder – Web Application for Meta Prompting

## 🎯 Project Goal

Develop a web application that allows users to:
- Select a task category (e.g., Development → Testing → Unit Tests),
- Each category is strictly linked to a **Prompt Template** (metaprompt),
- The `PromptTemplate` is used to generate the final prompt using input values from the UI,
- The final prompt is sent to a language model (LLM) via **OpenRouter** API,
- The response is returned and displayed in the web interface.

---

## 📦 Technologies

- **Backend:** .NET 8
- **Frontend:** React
- **Database:** SQLite
- **LLM Integration:** OpenRouter
- **Template Format:** Jinja2-style (e.g., `{{input}}`, `{{language}}`)

---

## 🧩 Data Model

### Table: `prompt_templates`

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Template identifier |
| name | TEXT | Template name |
| template | TEXT | Jinja-style metaprompt |
| model | TEXT | Default LLM model (e.g., `gpt-4`) |

---

### Table: `categories`

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Category ID |
| name | TEXT | Category name |
| parent_id | INTEGER (FK) | For tree structure |
| prompt_template_id | INTEGER (FK, NOT NULL) | **Required link to template** |

---

## 🔁 User Flow

1. User selects a category from a tree structure
2. Backend fetches the associated `prompt_template`
3. Template is rendered using user input → final prompt
4. Prompt is sent to the LLM via OpenRouter
5. Response is returned and shown to the user

---

## ⚙️ API Design

### `GET /categories`
- Returns the full tree structure of categories

### `POST /generate`
- Request:
```json
{
  "category_id": 3,
  "input": {
    "language": "C#",
    "task": "Function CalculateVat"
  }
}
