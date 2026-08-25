package br.edu.ufape.poo.UfapeMarket.comunicacao.conversor;

import org.springframework.stereotype.Component;

import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.VendaDTORequest;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.VendaDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Venda;

@Component
public class VendaConversor {

    public Venda paraEntidade(VendaDTORequest dto) {

        Venda venda = new Venda();

        venda.setDataVenda(dto.dataVenda());
        venda.setQuantidadeVendida(dto.quantidadeVendida());

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