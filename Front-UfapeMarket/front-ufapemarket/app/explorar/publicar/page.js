"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PublicarProdutoPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const [precoExibicao, setPrecoExibicao] = useState("");
  const [precoReal, setPrecoReal] = useState(0);

  const [quantidade, setQuantidade] = useState("1");

  // Estado unificado e corrigido para a disponibilidade
  const [disponivelParaVenda, setDisponivelParaVenda] = useState(true);

  const [categoriasBanco, setCategoriasBanco] = useState([]);
  const [categoria, setCategoria] = useState("");

  const [turno, setTurno] = useState("Integral");
  const [pagamentos, setPagamentos] = useState({
    pix: true,
    dinheiro: false,
    cartao: false,
    transferencia: false,
  });

  // Imagens predefinidas (simulando o carrossel da imagem)
  const imagensPreset = [
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400",
  ];

  const [imagemSelecionada, setImagemSelecionada] = useState(imagensPreset[0]);
  const [nomeUsuarioLogado, setNomeUsuarioLogado] = useState("Estudante UFAPE");

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
      try {
        const dados = JSON.parse(usuarioSalvo);
        if (dados.nome) setNomeUsuarioLogado(dados.nome);
      } catch (e) {
        console.error(e);
      }
    }

    // Busca as categorias
    fetch("http://localhost:8081/categorias")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar categorias");
        return res.json();
      })
      .then((data) => {
        setCategoriasBanco(data);
      })
      .catch((err) => {
        console.error("Não foi possível carregar categorias do banco:", err);
      });
  }, []);

  // Conversão monetária
  const handlePrecoChange = (e) => {
    const valorLimpo = e.target.value.replace(/\D/g, "");
    if (!valorLimpo) {
      setPrecoExibicao("");
      setPrecoReal(0);
      return;
    }

    const numero = Number(valorLimpo) / 100;
    setPrecoReal(numero);
    setPrecoExibicao(
      numero.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    );
  };

  const handleCheckboxChange = (tipo) => {
    setPagamentos((prev) => ({ ...prev, [tipo]: !prev[tipo] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pega o ID do usuário logado do localStorage (ou define 1 como fallback se não encontrar)
    let usuarioId = 1;
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
      try {
        const dados = JSON.parse(usuarioSalvo);
        if (dados.id) usuarioId = dados.id;
      } catch (err) {
        console.error(err);
      }
    }

    // Estrutura o JSON exatamente igual ao ProdutoDTORequest do Spring Boot
    const novoProduto = {
      nome: nome,
      descricaoProduto: descricao,
      preco: precoReal,
      quantidadeDisponivel: parseInt(quantidade) || 1,
      idCategoria: parseInt(categoria) || 1,
      idVendedor: usuarioId,
      fotoProduto: imagemSelecionada,
      turnoDisponibilidade: turno,
      formasPagamento: Object.keys(pagamentos)
        .filter((k) => pagamentos[k])
        .join(", "),
      disponivelParaVenda: Boolean(disponivelParaVenda),
      disponivel: Boolean(disponivelParaVenda), // Cobre caso o backend espere 'disponivel'
    };

    try {
      const response = await fetch("http://localhost:8081/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoProduto),
      });

      if (response.ok) {
        router.push("/explorar");
      } else {
        const erroTxt = await response.text();
        alert("Erro ao salvar produto: " + erroTxt);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Não foi possível conectar ao servidor Spring Boot.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Voltar e Cabeçalho */}
      <div>
        <Link
          href="/explorar"
          className="text-xs font-semibold text-brand-600 hover:underline"
        >
          &lt; Voltar
        </Link>
        <h1 className="text-2xl font-extrabold text-ink mt-1">
          Publicar produto
        </h1>
        <p className="text-sm text-ink-soft">
          Preencha os detalhes e anuncie para toda a UFAPE.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* COLUNA ESQUERDA / CENTRO: FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Seção Foto do Produto */}
          <div className="bg-surface p-6 rounded-3xl border border-line space-y-4">
            <label className="text-xs font-bold text-ink uppercase tracking-wider block">
              Foto do produto
            </label>

            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {imagensPreset.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setImagemSelecionada(img)}
                  className={`w-16 h-16 rounded-2xl overflow-hidden border-2 cursor-pointer shrink-0 transition-all ${
                    imagemSelecionada === img
                      ? "border-brand-500 scale-105 shadow-sm"
                      : "border-line opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt="Preset"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              <label className="w-16 h-16 rounded-2xl border-2 border-dashed border-line flex flex-col items-center justify-center text-ink-faint cursor-pointer hover:border-brand-500 hover:text-brand-500 transition-all shrink-0">
                <span className="text-lg font-bold">+</span>
                <span className="text-[10px]">Upload</span>
              </label>
            </div>
          </div>

          {/* Seção Detalhes Principais */}
          <div className="bg-surface p-6 rounded-3xl border border-line space-y-5">
            {/* Nome do Produto */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink uppercase tracking-wider">
                Nome do produto *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Calculadora Científica HP"
                className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-ink-faint"
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink uppercase tracking-wider">
                Descrição *
              </label>
              <textarea
                rows="3"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o estado, detalhes e diferenciais do produto."
                className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-ink-faint resize-none"
                required
              ></textarea>
            </div>

            {/* Preço e Quantidade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink uppercase tracking-wider">
                  Preço (R$) *
                </label>
                <input
                  type="text"
                  value={precoExibicao}
                  onChange={handlePrecoChange}
                  placeholder="0,00"
                  className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-ink-faint"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink uppercase tracking-wider">
                  Quantidade disponível *
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Categoria e Turno */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink uppercase tracking-wider">
                  Categoria *
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer"
                  required
                >
                  <option value="">Selecione a categoria</option>
                  {categoriasBanco.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink uppercase tracking-wider">
                  Turno de disponibilidade
                </label>
                <select
                  value={turno}
                  onChange={(e) => setTurno(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer"
                >
                  <option value="Integral">Integral</option>
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
              </div>
            </div>

            {/* Formas de Pagamento */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-ink uppercase tracking-wider block">
                Formas de pagamento *
              </label>
              <div className="flex flex-wrap gap-6 text-sm text-ink-soft">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pagamentos.pix}
                    onChange={() => handleCheckboxChange("pix")}
                    className="accent-brand-500 w-4 h-4"
                  />
                  Pix
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pagamentos.dinheiro}
                    onChange={() => handleCheckboxChange("dinheiro")}
                    className="accent-brand-500 w-4 h-4"
                  />
                  Dinheiro
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pagamentos.cartao}
                    onChange={() => handleCheckboxChange("cartao")}
                    className="accent-brand-500 w-4 h-4"
                  />
                  Cartão
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pagamentos.transferencia}
                    onChange={() => handleCheckboxChange("transferencia")}
                    className="accent-brand-500 w-4 h-4"
                  />
                  Transferência
                </label>
              </div>
            </div>

            {/* Toggle Disponível para Venda */}
            <div className="pt-4 border-t border-line flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-ink uppercase tracking-wider">
                  Disponível para venda
                </p>
                <p className="text-xs text-ink-faint">
                  Desative para pausar o anúncio temporariamente.
                </p>
              </div>
              <input
                type="checkbox"
                checked={disponivelParaVenda}
                onChange={(e) => setDisponivelParaVenda(e.target.checked)}
                className="toggle accent-brand-500 w-5 h-5 cursor-pointer"
              />
            </div>
          </div>

          {/* Botões de Ação Inferiores */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Publicar produto
            </button>
            <Link
              href="/explorar"
              className="px-6 py-3.5 rounded-2xl border border-line bg-surface text-ink-soft hover:bg-canvas font-semibold text-sm transition-all text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>

        {/* COLUNA DIREITA: PRÉ-VISUALIZAÇÃO AO VIVO */}
        <div className="lg:sticky lg:top-24 space-y-3">
          <span className="text-xs font-bold text-ink-faint uppercase tracking-wider block">
            👁️ Pré-visualização
          </span>

          <div className="bg-surface rounded-3xl border border-line overflow-hidden shadow-sm flex flex-col">
            <div className="relative h-56 w-full bg-canvas overflow-hidden">
              <img
                src={imagemSelecionada}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 space-y-3">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-ink line-clamp-1">
                  {nome || "Nome do produto"}
                </h3>
                <span className="font-extrabold text-lg text-brand-600 block">
                  R$ {precoExibicao || "0,00"}
                </span>
              </div>

              <p className="text-xs text-ink-faint line-clamp-2">
                {descricao || "A descrição do produto aparecerá aqui."}
              </p>

              <div className="pt-3 border-t border-line flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                  {nomeUsuarioLogado.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-ink-soft truncate">
                  {nomeUsuarioLogado}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
