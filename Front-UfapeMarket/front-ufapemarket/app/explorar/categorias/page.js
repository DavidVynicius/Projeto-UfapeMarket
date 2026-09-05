import Link from "next/link";

import {
  BookOpen,
  Laptop,
  Utensils,
  Pencil,
  Shirt,
  Watch,
  ArrowRight,
  Tags
} from "lucide-react";

const configuracoes = {
  livros: {
    icone: BookOpen,
    fundo: "#E8F5E9",
    cor: "#2E7D32"
  },

  eletrônicos: {
    icone: Laptop,
    fundo: "#E3F2FD",
    cor: "#1565C0"
  },

  eletronicos: {
    icone: Laptop,
    fundo: "#E3F2FD",
    cor: "#1565C0"
  },

  alimentos: {
    icone: Utensils,
    fundo: "#FFF3E0",
    cor: "#EF6C00"
  },

  "material escolar": {
    icone: Pencil,
    fundo: "#F3E5F5",
    cor: "#7B1FA2"
  },

  vestuário: {
    icone: Shirt,
    fundo: "#FCE4EC",
    cor: "#C2185B"
  },

  vestuario: {
    icone: Shirt,
    fundo: "#FCE4EC",
    cor: "#C2185B"
  },

  acessórios: {
    icone: Watch,
    fundo: "#E0F2F1",
    cor: "#00796B"
  },

  acessorios: {
    icone: Watch,
    fundo: "#E0F2F1",
    cor: "#00796B"
  }
};

function pegarConfiguracao(nome) {
  const chave = nome.toLowerCase();

  return (
    configuracoes[chave] || {
      icone: Tags,
      fundo: "#EEF2F0",
      cor: "#198754"
    }
  );
}

async function buscarDados() {
  try {
    const resCategorias = await fetch(
      "http://localhost:8081/categorias",
      {
        cache: "no-store"
      }
    );

    if (!resCategorias.ok) {
      throw new Error("Erro ao buscar categorias");
    }

    const categorias = await resCategorias.json();

    let produtos = [];

    try {
      const resProdutos = await fetch(
        "http://localhost:8081/produtos",
        {
          cache: "no-store"
        }
      );

      if (resProdutos.ok) {
        produtos = await resProdutos.json();
      }
    } catch (erroProdutos) {
      console.error(
        "Erro ao buscar produtos:",
        erroProdutos
      );
    }

    return {
      categorias,
      produtos,
      erro: false
    };
  } catch (erro) {
    console.error(
      "Erro ao buscar categorias:",
      erro
    );

    return {
      categorias: [],
      produtos: [],
      erro: true
    };
  }
}

export default async function CategoriasPage() {
  const {
    categorias,
    produtos,
    erro
  } = await buscarDados();

  function contarProdutosDaCategoria(idCategoria) {
    return produtos.filter(
      (produto) =>
        Number(produto.idCategoria) ===
        Number(idCategoria)
    ).length;
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#17231d]">
            Categorias
          </h1>

          <p className="mt-2 text-lg text-gray-500">
            Navegue pelos tipos de produtos disponíveis no campus.
          </p>
        </div>

        {erro ? (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-600">
            Não foi possível carregar as categorias.
          </div>
        ) : categorias.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">

            <Tags
              size={42}
              className="mx-auto mb-4 text-gray-400"
            />

            <p className="text-gray-500">
              Nenhuma categoria cadastrada no momento.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {categorias.map((categoria) => {
              const config =
                pegarConfiguracao(categoria.nome);

              const Icone = config.icone;

              const quantidadeProdutos =
                contarProdutosDaCategoria(
                  categoria.id
                );

              return (
                <div
                  key={categoria.id}
                  className="relative overflow-hidden rounded-2xl border border-[#e6e6df] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >

                  <div
                    className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-40"
                    style={{
                      backgroundColor:
                        config.fundo
                    }}
                  />

                  <div
                    className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor:
                        config.fundo,
                      color:
                        config.cor
                    }}
                  >
                    <Icone
                      size={28}
                      strokeWidth={2}
                    />
                  </div>

                  <h2 className="relative text-xl font-semibold text-[#17231d]">
                    {categoria.nome}
                  </h2>

                  <p className="relative mt-2 text-sm text-gray-500">
                    {quantidadeProdutos}{" "}
                    {quantidadeProdutos === 1
                      ? "produto"
                      : "produtos"}
                  </p>

                  <Link
                    href={`/explorar/busca?categoria=${categoria.id}`}
                    className="relative mt-6 flex items-center gap-2 font-semibold transition hover:gap-3"
                    style={{
                      color: config.cor
                    }}
                  >
                    Explorar
                    <ArrowRight size={18} />
                  </Link>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}