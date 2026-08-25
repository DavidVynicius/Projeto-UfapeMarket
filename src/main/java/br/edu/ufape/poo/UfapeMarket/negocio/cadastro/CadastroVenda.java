package br.edu.ufape.poo.UfapeMarket.negocio.cadastro;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.edu.ufape.poo.UfapeMarket.dados.InterfaceRepositorioVenda;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Venda;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoQuantidadeInvalidaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.VendaDataObrigatoriaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.VendaProdutoObrigatorioException;

@Service
public class CadastroVenda implements InterfaceCadastroVenda {

    @Autowired
    private InterfaceRepositorioVenda repositorioVenda;

    @Override
    public Venda salvarVenda(Venda venda)
            throws VendaDataObrigatoriaException,
                   VendaProdutoObrigatorioException,
                   ProdutoQuantidadeInvalidaException {

        if (venda == null) {
            throw new IllegalArgumentException("Venda não pode ser nula.");
        }

        if (venda.getDataVenda() == null) {
            throw new VendaDataObrigatoriaException();
        }

        if (venda.getProduto() == null) {
            throw new VendaProdutoObrigatorioException();
        }

        if (venda.getQuantidadeVendida() <= 0) {
            throw new ProdutoQuantidadeInvalidaException();
        }

        return repositorioVenda.save(venda);
    }

    @Override
    public List<Venda> listarVendas() {
        return repositorioVenda.findAll();
    }

    @Override
    public Optional<Venda> procurarVendaID(Long id) {
        return repositorioVenda.findById(id);
    }

    @Override
    public void deletarVendaId(Long id) {

        Venda venda = repositorioVenda.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Venda não encontrada."));

        repositorioVenda.delete(venda);
    }
}