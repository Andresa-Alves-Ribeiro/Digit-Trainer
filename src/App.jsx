import { useState, useEffect } from "react";
import "./App.css";

const DIGITO_POR_EXTENSO = {
  0: "zero",
  1: "um",
  2: "dois",
  3: "três",
  4: "quatro",
  5: "cinco",
  6: "seis",
  7: "sete",
  8: "oito",
  9: "nove",
};

function itemParaFala(item) {
  if (typeof item === "number" && !Number.isNaN(item)) {
    return DIGITO_POR_EXTENSO[item] ?? String(item);
  }
  const s = String(item).trim();
  if (/^\d$/.test(s)) {
    return DIGITO_POR_EXTENSO[Number(s)] ?? s;
  }
  const letra = s.toUpperCase();
  if (/^[A-Z]$/.test(letra)) {
    return letra;
  }
  return s;
}

function obterVozPortugues() {
  const voices = speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang?.toLowerCase() === "pt-br") ||
    voices.find((v) => v.lang?.toLowerCase().startsWith("pt")) ||
    null
  );
}

/** Sempre: número–letra–número–… ou letra–número–letra–… (começo aleatório só quando há o mesmo nº de cada). */
function intercalarNumerosELetras(nums, letras) {
  if (nums.length === 0) return [...letras];
  if (letras.length === 0) return [...nums];
  const out = [];
  let i = 0;
  let j = 0;
  let useNum;
  if (nums.length > letras.length) {
    useNum = true;
  } else if (letras.length > nums.length) {
    useNum = false;
  } else {
    useNum = Math.random() < 0.5;
  }
  while (i < nums.length && j < letras.length) {
    if (useNum) {
      out.push(nums[i++]);
    } else {
      out.push(letras[j++]);
    }
    useNum = !useNum;
  }
  while (i < nums.length) out.push(nums[i++]);
  while (j < letras.length) out.push(letras[j++]);
  return out;
}

function itemEhDigitoNaSequencia(x) {
  return typeof x === "number" && Number.isInteger(x) && x >= 0 && x <= 9;
}

export default function DigitTrainer() {
  const [tamanho, setTamanho] = useState(5);
  const [modo, setModo] = useState("normal");
  const [velocidade, setVelocidade] = useState(1);
  const [pausa, setPausa] = useState(500);

  const [sequencia, setSequencia] = useState([]);
  const [input, setInput] = useState("");
  const [resultado, setResultado] = useState(null);
  const [tocando, setTocando] = useState(false);
  const [mostrarResposta, setMostrarResposta] = useState(false);

  useEffect(() => {
    function warmVoices() {
      speechSynthesis.getVoices();
    }
    warmVoices();
    speechSynthesis.addEventListener("voiceschanged", warmVoices);
    return () =>
      speechSynthesis.removeEventListener("voiceschanged", warmVoices);
  }, []);

  function gerarSequencia(n) {
    const nums = Array.from({ length: 10 }, (_, i) => i);
    return nums.sort(() => Math.random() - 0.5).slice(0, n);
  }

  function gerarSequenciaLetras(total) {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const nums = Array.from({ length: 10 }, (_, i) => i);

    let numLetras;
    if (total === 1) {
      numLetras = Math.random() < 0.5 ? 1 : 0;
    } else {
      if (total % 2 === 0) {
        numLetras = total / 2;
      } else {
        const low = (total - 1) / 2;
        const high = (total + 1) / 2;
        numLetras = Math.random() < 0.5 ? low : high;
      }
    }
    const numNumeros = total - numLetras;

    const letrasEscolhidas = letras
      .sort(() => Math.random() - 0.5)
      .slice(0, numLetras);

    const numsEscolhidos = nums
      .sort(() => Math.random() - 0.5)
      .slice(0, numNumeros);

    return intercalarNumerosELetras(numsEscolhidos, letrasEscolhidas);
  }

  function falarItem(item) {
    return new Promise((resolve) => {
      const texto = itemParaFala(item);
      if (!texto) {
        resolve();
        return;
      }
      const utter = new SpeechSynthesisUtterance(texto);
      utter.lang = "pt-BR";
      // Chrome fica com a fila presa com rate muito acima de 2
      utter.rate = Math.min(velocidade, 2);
      const voz = obterVozPortugues();
      if (voz) utter.voice = voz;

      let concluiu = false;
      const finalizar = () => {
        if (concluiu) return;
        concluiu = true;
        clearTimeout(seguranca);
        resolve();
      };

      const seguranca = setTimeout(finalizar, 12000);

      utter.addEventListener("end", finalizar, { once: true });
      utter.addEventListener("error", finalizar, { once: true });

      speechSynthesis.speak(utter);
    });
  }

  async function falarSequencia(seq) {
    speechSynthesis.cancel();
    // Imediatamente após cancel(), o 1.º speak() pode ser ignorado no Chrome/Edge
    await new Promise((r) => setTimeout(r, 80));
    for (const item of seq) {
      await falarItem(item);
      await new Promise((r) => setTimeout(r, pausa));
    }
  }

  async function iniciar() {
    let seq;

    if (modo === "letras") {
      seq = gerarSequenciaLetras(tamanho);
    } else {
      seq = gerarSequencia(tamanho);
    }

    setSequencia(seq);
    setResultado(null);
    setInput("");
    setMostrarResposta(false);
    setTocando(true);

    await falarSequencia(seq);

    setTocando(false);
  }

  function verificar() {
    if (sequencia.length === 0) {
      return;
    }

    const resposta = input.trim().toUpperCase().split("");
    const correto = getCorretoArray();

    if (resposta.length === 0 || resposta.length !== correto.length) {
      setResultado("errou");
      return;
    }

    if (JSON.stringify(resposta) === JSON.stringify(correto)) {
      setResultado("acertou");
    } else {
      setResultado("errou");
    }
  }

  function getCorretoArray() {
    if (modo === "normal") {
      return sequencia.map(String);
    }
    if (modo === "invertido") {
      return [...sequencia].reverse().map(String);
    }
    if (modo === "letras") {
      const nums = sequencia
        .filter(itemEhDigitoNaSequencia)
        .map(String)
        .sort((a, b) => a - b);

      const letras = sequencia
        .filter((x) => !itemEhDigitoNaSequencia(x))
        .map(String)
        .sort();

      return [...nums, ...letras];
    }
    return [];
  }

  function getCorreto() {
    return getCorretoArray().join("");
  }

  function tentarDeNovo() {
    setResultado(null);
    setInput("");
    setMostrarResposta(false);
  }

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <h1>Digit Trainer</h1>
          <p>Treine sua memória auditiva com sequências</p>
        </div>

        <div className="grid">
          <div className="field">
            <label>Tamanho</label>
            <input
              type="number"
              min={1}
              max={10}
              value={tamanho}
              onChange={(e) => setTamanho(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>Modo</label>
            <select value={modo} onChange={(e) => setModo(e.target.value)}>
              <option value="normal">Normal</option>
              <option value="invertido">Invertido</option>
              <option value="letras">Com letras</option>
            </select>
          </div>

          <div className="field">
            <label>Velocidade</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={velocidade}
              onChange={(e) => setVelocidade(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>Pausa (ms)</label>
            <input
              type="number"
              min="0"
              step="50"
              value={pausa}
              onChange={(e) => setPausa(Number(e.target.value))}
            />
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={iniciar}
          disabled={tocando}
        >
          {tocando ? "Reproduzindo…" : "▶ Ouvir sequência"}
        </button>

        <div className="answer-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite a resposta"
            onKeyDown={(e) => e.key === "Enter" && verificar()}
          />
          <button className="btn btn-secondary" onClick={verificar}>
            Verificar
          </button>
        </div>

        {resultado === "acertou" && (
          <div className="feedback success">
            <div className="feedback-icon">✓</div>
            <span>Parabéns, você acertou!</span>
          </div>
        )}

        {resultado === "errou" && (
          <div className="feedback error">
            <div className="feedback-head">
              <div className="feedback-icon">✕</div>
              <span>Resposta incorreta</span>
            </div>

            {mostrarResposta && (
              <div className="reveal">{getCorreto()}</div>
            )}

            <div className="feedback-actions">
              <button className="btn btn-secondary" onClick={tentarDeNovo}>
                Tentar de novo
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setMostrarResposta(true)}
              >
                Ver resposta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
