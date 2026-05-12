# 🧠 Digit Trainer

Aplicação web para treinar **memória auditiva** com sequências de dígitos (e, em um dos modos, letras). Os números são falados em português pela síntese de voz do navegador; você ouve, memoriza e digita a resposta conforme o modo escolhido.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![JavaScript](https://img.shields.io/badge/JavaScript-ESM-F7DF1E?logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)

---

## 📸 Preview

Tela Principal

<img width="1119" height="802" alt="Captura de tela 2026-05-12 202058" src="https://github.com/user-attachments/assets/d0d79055-dfec-4170-bde9-46807b28baf9" />

Resposta com Feedback

<img width="1270" height="723" alt="image" src="https://github.com/user-attachments/assets/711692bc-d583-4c4f-b3c0-7ed919655b89" />

---

## ✨ Funcionalidades

- **Síntese de voz em português (pt-BR)** — Dígitos falados por extenso (zero, um, dois…); letras no modo misto são enunciadas como nomes de letras.
- **Três modos de jogo** — **Normal** (repita a sequência na ordem ouvida), **Invertido** (digite na ordem inversa) e **Com letras** (sequência intercalada de números e letras; a resposta correta é os dígitos ordenados seguidos das letras ordenadas).
- **Controles de treino** — Tamanho da sequência (1 a 10), velocidade da fala e pausa em milissegundos entre cada item.
- **Feedback imediato** — Mensagens de acerto ou erro, opção de ver a resposta correta e tentar de novo.
- **Compatibilidade com navegadores** — Uso da Web Speech API (`speechSynthesis`); pequeno atraso após `cancel()` para evitar falhas conhecidas no Chrome/Edge.
- **Interface simples e focada** — Um único fluxo: ouvir → digitar → verificar (Enter no campo também dispara a verificação).

---

## 🎯 Modos em resumo

| Modo | O que você deve digitar |
|------|-------------------------|
| **Normal** | A sequência exatamente como foi ouvida (cada dígito como caractere numérico). |
| **Invertido** | A mesma sequência, na **ordem inversa**. |
| **Com letras** | Primeiro todos os **dígitos** da rodada, em **ordem crescente**, depois todas as **letras**, em **ordem alfabética** (sem espaços). |

---

## 🛠️ Tecnologias

- **React 19** — Interface e estado com hooks (`useState`, `useEffect`).
- **JavaScript (ES modules)** — Sem TypeScript neste repositório.
- **Vite** — Servidor de desenvolvimento e build de produção.
- **ESLint** — Lint do código (configuração flat com plugins React Hooks e React Refresh).
- **Web Speech API** — `SpeechSynthesisUtterance` para leitura em voz alta.

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior (recomendado alinhar à versão suportada pelo Vite 8).
- [npm](https://www.npmjs.com/) (vem com o Node) ou outro cliente compatível (`pnpm`, `yarn`).

---

## 🚀 Instalação

```bash
# Clone o repositório (substitua pela URL do seu fork/repositório)
git clone <URL_DO_SEU_REPOSITORIO>

# Entre na pasta do projeto
cd meu-projeto

# Instale as dependências
npm install
```

---

## ▶️ Executando o projeto

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

Abra o endereço indicado no terminal (em geral `http://localhost:5173`). **Permita som/voz no navegador** se solicitado; a leitura depende de vozes instaladas no sistema (idealmente uma voz em português).

---

## 📜 Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento Vite |
| `npm run build` | Gera o build otimizado em `dist/` |
| `npm run preview` | Serve localmente o conteúdo de `dist/` |
| `npm run lint` | Executa o ESLint no projeto |

---

## 📁 Estrutura do projeto

```
src/
├── App.jsx       # Componente principal Digit Trainer (lógica, UI e fala)
├── App.css       # Estilos do cartão principal e controles
├── index.css     # Estilos globais / reset
└── main.jsx      # Ponto de entrada React (createRoot)
```

Arquivos na raiz relevantes: `index.html`, `vite.config.js`, `eslint.config.js`, `package.json`.

---

## 🎮 Como usar

1. Ajuste **Tamanho** (quantidade de itens na sequência), **Modo**, **Velocidade** da fala e **Pausa** entre itens.
2. Clique em **Ouvir sequência** e preste atenção à ordem e ao conteúdo (no modo com letras, números e letras aparecem intercalados).
3. Digite a resposta no campo (no modo **Com letras**, lembre da regra: dígitos ordenados + letras ordenadas).
4. Pressione **Verificar** ou **Enter**.
5. Se errar, use **Ver resposta** ou **Tentar de novo**.

---

## 🔊 Notas sobre áudio e voz

- A qualidade e o sotaque dependem do **navegador** e das **vozes** instaladas no sistema.
- Em alguns ambientes, as vozes só ficam disponíveis após o evento `voiceschanged`; o app já tenta carregar voz em `pt-BR` ou outro `pt` quando possível.

---

## 📄 Licença

Este projeto é de uso **pessoal/educacional**.

---

## 👩‍💻 Autora

Hi! 👋 I'm Andresa Alves Ribeiro, a Front-end/Full-Stack developer and Information Systems student. I love creating solutions to complex problems and am always excited to learn new technologies.

### Connect with me

<p align="center">
  <a href="mailto:andresa_15ga@hotmail.com"><img src="https://img.shields.io/static/v1?logoWidth=15&logoColor=ff69b4&logo=gmail&label=Email&message=andresa_15ga@hotmail.com&color=ff69b4" target="_blank"></a>
  <a href="https://www.linkedin.com/in/andresa-alves-ribeiro/"><img alt="LinkedIn Profile" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=0A66C2&logo=LinkedIn&label=LinkedIn&message=andresa-alves-ribeiro&color=0A66C2"></a>
  <a href="https://www.instagram.com/dresa.alves/"><img alt="Instagram Profile" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=E4405F&logo=Instagram&label=Instagram&message=@dresa.alves&color=E4405F"></a>
</p>
