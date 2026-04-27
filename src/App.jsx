import { useState } from "react";
import "./App.css";

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
      const minL = 1;
      const maxL = total - 1;
      numLetras = minL + Math.floor(Math.random() * (maxL - minL + 1));
    }
    const numNumeros = total - numLetras;

    const letrasEscolhidas = letras
      .sort(() => Math.random() - 0.5)
      .slice(0, numLetras);

    const numsEscolhidos = nums
      .sort(() => Math.random() - 0.5)
      .slice(0, numNumeros);

    return letrasEscolhidas
      .concat(numsEscolhidos)
      .sort(() => Math.random() - 0.5);
  }

  function falarNumero(item) {
    return new Promise((resolve) => {
      const utter = new SpeechSynthesisUtterance(item.toString());
      utter.rate = velocidade;
      utter.onend = resolve;
      speechSynthesis.speak(utter);
    });
  }

  async function falarSequencia(seq) {
    for (let item of seq) {
      await falarNumero(item);
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
    const resposta = input.toUpperCase().split("");
    const correto = getCorretoArray();

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
        .filter((x) => !isNaN(x))
        .map(String)
        .sort((a, b) => a - b);

      const letras = sequencia
        .filter((x) => isNaN(x))
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
