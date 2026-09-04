package br.edu.ufape.poo.UfapeMarket.negocio.cadastro;

import java.util.List;
import java.util.Optional;

import br.edu.ufape.poo.UfapeMarket.negocio.basica.Venda;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoQuantidadeInvalidaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.VendaDataObrigatoriaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.VendaProdutoObrigatorioException;

public interface InterfaceCadastroVenda {

    Venda salvarVenda(Venda venda)
            throws VendaDataObrigatoriaException,
                   VendaProdutoObrigatorioException,
                   ProdutoQuantidadeInvalidaException;

    List<Venda> listarVendas();

    Optional<Venda> procurarVendaID(Long id);

    void deletarVendaId(Long id) throws ProdutoQuantidadeInvalidaException;
}