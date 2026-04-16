import { useState } from "react";

export default function App() {
  const [tamanho, setTamanho] = useState(5);
  const [modo, setModo] = useState("normal");
  const [velocidade, setVelocidade] = useState(1); // 1 = normal
  const [pausa, setPausa] = useState(500); // ms

  const [sequencia, setSequencia] = useState([]);
  const [input, setInput] = useState("");
  const [resultado, setResultado] = useState(null);

  function gerarSequencia(n) {
    const nums = Array.from({ length: 10 }, (_, i) => i);
    const embaralhado = nums.sort(() => Math.random() - 0.5);
    return embaralhado.slice(0, n);
  }

  function falarNumero(numero) {
    return new Promise((resolve) => {
      const utter = new SpeechSynthesisUtterance(numero.toString());
      utter.rate = velocidade;
      utter.onend = resolve;
      speechSynthesis.speak(utter);
    });
  }

  async function falarSequencia(seq) {
    for (let n of seq) {
      await falarNumero(n);
      await new Promise((r) => setTimeout(r, pausa));
    }
  }

  async function iniciar() {
    const seq = gerarSequencia(tamanho);
    setSequencia(seq);
    setResultado(null);
    setInput("");

    await falarSequencia(seq);
  }

  function verificar() {
    const resposta = input.split("").map(Number);
    const correto =
      modo === "invertido" ? [...sequencia].reverse() : sequencia;

    if (JSON.stringify(resposta) === JSON.stringify(correto)) {
      setResultado("acertou");
    } else {
      setResultado("errou");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Digit Trainer</h2>

      <div>
        <label>Tamanho: </label>
        <input
          type="number"
          value={tamanho}
          min={1}
          max={10}
          onChange={(e) => setTamanho(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Modo: </label>
        <select value={modo} onChange={(e) => setModo(e.target.value)}>
          <option value="normal">Normal</option>
          <option value="invertido">Invertido</option>
        </select>
      </div>

      <div>
        <label>Velocidade da fala: </label>
        <input
          type="number"
          step="0.1"
          value={velocidade}
          onChange={(e) => setVelocidade(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Pausa (ms): </label>
        <input
          type="number"
          value={pausa}
          onChange={(e) => setPausa(Number(e.target.value))}
        />
      </div>

      <button onClick={iniciar}>▶ Ouvir sequência</button>

      <div style={{ marginTop: 20 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite os números"
        />
        <button onClick={verificar}>Verificar</button>
      </div>

      {resultado === "acertou" && <p>✔ Acertou</p>}

      {resultado === "errou" && (
        <div>
          <p>✘ Errou</p>
          <button onClick={verificar}>Tentar de novo</button>
          <button
            onClick={() => {
              const correto =
                modo === "invertido"
                  ? [...sequencia].reverse()
                  : sequencia;
              alert("Correto: " + correto.join(""));
            }}
          >
            Ver resposta
          </button>
        </div>
      )}
    </div>
  );
}