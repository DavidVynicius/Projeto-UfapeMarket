package br.edu.ufape.poo.UfapeMarket.negocio.servico;

import java.util.Date;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;

@Component
public class JwtUtil {
    

    private final Key chaveSecreta = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long EXPIRACAO = 86400000;

    public String gerarToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRACAO))
                .signWith(chaveSecreta)
                .compact();
    }

    public String extrairEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(chaveSecreta)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}