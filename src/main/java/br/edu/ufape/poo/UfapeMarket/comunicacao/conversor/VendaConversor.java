package br.edu.ufape.poo.UfapeMarket.comunicacao.conversor;


import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoQuantidadeInvalidaException;
import org.springframework.stereotype.Component;

import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.VendaDTORequest;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.VendaDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Venda;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoQuantidadeInvalidaException;

@Component
public class VendaConversor {

	public Venda paraEntidade(VendaDTORequest dto)
	        throws ProdutoQuantidadeInvalidaException {

	    Venda venda = new Venda();

	    venda.setDataVenda(dto.dataVenda());
	    venda.alterarQuantidadeVendida(dto.quantidadeVendida());

	    return venda;
	}

    public VendaDTOResponse paraResponse(Venda venda) {

        Long idProduto = venda.getProduto() != null
                ? venda.getProduto().getId()
                : null;

        return new VendaDTOResponse(
                venda.getId(),
                venda.getDataVenda(),
                venda.getQuantidadeVendida(),
                idProduto
        );
    }
}