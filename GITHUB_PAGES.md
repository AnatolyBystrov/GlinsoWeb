# GitHub Pages Deployment Guide

## 📋 Что было настроено

1. ✅ **GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
2. ✅ **Next.js Static Export** (`output: 'export'`)
3. ✅ **Base Path Configuration** (автоматически для GitHub Pages)
4. ✅ **Jekyll Bypass** (`.nojekyll` файл)

## 🚀 Пошаговая инструкция

### Шаг 1: Настройка GitHub Pages

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** → **Pages**
3. В разделе **Build and deployment**:
   - **Source:** Выберите **GitHub Actions** (не "Deploy from a branch"!)
   - Это важно! Если стоит "Deploy from a branch" - сайт не запустится

### Шаг 2: Подготовка кода

Убедитесь что все файлы готовы:

```bash
# Проверьте что есть эти файлы:
.github/workflows/deploy.yml  ✓
next.config.mjs               ✓ (обновлен)
public/.nojekyll              ✓
```

### Шаг 3: Коммит и Push

```bash
# Если еще не инициализирован Git:
git init

# Добавьте все файлы
git add .

# Создайте коммит
git commit -m "Configure for GitHub Pages deployment"

# Добавьте удаленный репозиторий (замените на свой URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Запушьте в main ветку
git push -u origin main
```

### Шаг 4: Проверка деплоя

1. Перейдите в **Actions** вкладку на GitHub
2. Вы увидите запущенный workflow "Deploy Next.js to GitHub Pages"
3. Дождитесь завершения (обычно 2-5 минут)
4. Если появится зеленая галочка ✓ - деплой успешен!

### Шаг 5: Открыть сайт

Ваш сайт будет доступен по адресу:

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

Например, если:
- Username: `glinsouae`
- Repo: `GlinsoWeb`

Тогда сайт: `https://glinsouae.github.io/GlinsoWeb/`

## 🌐 DNS Configuration for Custom Domain (glinso.ae)

To connect `glinso.ae` to GitHub Pages you need to add DNS records at your domain registrar (e.g. GoDaddy, Namecheap, etc.).

### Step 1: Add A Records (root domain `@`)

GitHub Pages requires **four A records** for the apex domain:

| Type | Name | Value            | TTL  |
|------|------|-----------------|------|
| A    | @    | 185.199.108.153 | 3600 |
| A    | @    | 185.199.109.153 | 3600 |
| A    | @    | 185.199.110.153 | 3600 |
| A    | @    | 185.199.111.153 | 3600 |

### Step 2: Add CNAME Record (www subdomain)

| Type  | Name | Value                      | TTL  |
|-------|------|---------------------------|------|
| CNAME | www  | anatolybystrov.github.io  | 3600 |

### Step 3: Verify the CNAME file in the repository

The `CNAME` file in the root of this repository must contain exactly:

```
glinso.ae
```

This file is already configured ✅ — it tells GitHub Pages to serve the site on `glinso.ae`.

### Step 4: Enable custom domain in GitHub Pages settings

1. Go to your repository on GitHub
2. **Settings** → **Pages**
3. Under **Custom domain**, enter `glinso.ae`
4. Click **Save**
5. Check **Enforce HTTPS** once the SSL certificate is provisioned (usually 5–30 minutes)

### Step 5: Check DNS propagation

After saving DNS records, propagation can take **5–30 minutes** (up to 48 hours in rare cases).

Check propagation status at: [whatsmydns.net](https://www.whatsmydns.net/#A/glinso.ae)

Once propagated, your site will be available at `https://glinso.ae` 🎉

---

## 🔧 Важные настройки

### Base Path

Код автоматически определяет, где он запущен:

- **Локально:** `basePath = /` (обычный режим)
- **GitHub Pages:** `basePath = /GlinsoWeb/` (автоматически)

Это значит:
- `npm run dev` - работает как обычно
- GitHub Pages - работает с правильными путями

### Images

Настроено `unoptimized: true` для изображений, потому что GitHub Pages - статический хостинг.

### API Routes

⚠️ **ВАЖНО:** API routes (`/api/contact`) **НЕ БУДУТ РАБОТАТЬ** на GitHub Pages!

GitHub Pages - это статический хостинг, он не поддерживает серверные функции.

**Решения:**
1. Используйте **Vercel** (рекомендуется) - поддерживает API routes
2. Используйте внешний email сервис с client-side интеграцией
3. Используйте Formspree/EmailJS для контактной формы

## 🐛 Решение проблем

### Проблема: Показывается README вместо сайта

**Причина:** Source стоит "Deploy from a branch"

**Решение:**
1. Settings → Pages
2. Source: **GitHub Actions**
3. Сделайте новый push для запуска workflow

### Проблема: 404 ошибка

**Причина:** Неправильный base path

**Решение:**
- Проверьте что имя репозитория совпадает с названием в URL
- Убедитесь что `.nojekyll` файл есть

### Проблема: Стили не загружаются

**Причина:** Неправильный assetPrefix

**Решение:**
- Убедитесь что `next.config.mjs` обновлен
- Пересоберите: удалите `.next` и `out`, запушьте снова

### Проблема: Workflow не запускается

**Причина:** GitHub Actions не включены

**Решение:**
1. Settings → Actions → General
2. Actions permissions: "Allow all actions"
3. Workflow permissions: "Read and write permissions"

## 📝 Альтернативный вариант: Vercel (рекомендуется)

Если вам нужна **контактная форма с email**, используйте Vercel:

### Почему Vercel лучше для этого проекта:

1. ✅ Поддержка API routes (контактная форма будет работать)
2. ✅ Автоматическая оптимизация изображений
3. ✅ Бесплатный SSL для custom domain
4. ✅ Мгновенный деплой при push
5. ✅ Edge Functions для лучшей производительности

### Быстрый деплой на Vercel:

```bash
npm i -g vercel
vercel --prod
```

Или через веб-интерфейс:
1. [vercel.com/new](https://vercel.com/new)
2. Import Git Repository
3. Deploy (всё настроено автоматически!)

## 🔄 Обновление сайта

После любых изменений:

```bash
git add .
git commit -m "Update website"
git push
```

GitHub Actions автоматически пересоберет и задеплоит сайт.

## 📊 Проверка статуса

- **Actions tab:** Смотрите статус деплоя
- **Settings → Pages:** Смотрите URL и статус
- **Environments:** Смотрите историю деплоев

## 🎯 Рекомендация

**Для production с контактной формой → Vercel**

**Для простого статического сайта → GitHub Pages**

---

Нужна помощь? Проверьте [DEPLOYMENT.md](./DEPLOYMENT.md) для полных инструкций по деплою.
