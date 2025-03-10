package org.spring.moviepj.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.util.JWTUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.google.gson.Gson;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JWTCheckFilter extends OncePerRequestFilter {

    @Override // 필터로 체크하지 않을 경로 Role -> 권한이용(여기에 설정해야됨 filter 때문에)
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

        // Preflight
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        String path = request.getRequestURI();

        // 중복된 if문을 하나로 합침
        if (path.startsWith("/api/member/") ||
                path.startsWith("/api/boxOfficeList") ||
                path.startsWith("/api/screening/") ||
                path.startsWith("/api/trailerList") ||
                path.startsWith("/chat") ||
                path.startsWith("/botController") ||
                path.startsWith("/api/cinemas") ||
                path.startsWith("/api/chat") ||
                path.startsWith("/api/reply") ||
                path.startsWith("/api/calendar") ||
                path.startsWith("/api/helpMessage") ||
                path.startsWith("/board") ||
                path.startsWith("/upload") ||
                path.startsWith("/api/memberList") || // ?
                path.startsWith("/api/search")) {
            return true; // JWT 검증 없이 접근 허용
        }

        return false; // 그 외 경로는 JWT 검증 필요
    }

    @Override // 체크할 경로(Access Token 검증을 통해 접근가능여부 판단)
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeaderStr = request.getHeader("Authorization");

        try {
            String accessToken = authHeaderStr.substring(7);
            Map<String, Object> claims = JWTUtil.validateToken(accessToken);

            String email = (String) claims.get("email");
            String pw = (String) claims.get("pw");
            String nickname = (String) claims.get("nickname");
            Boolean social = (Boolean) claims.get("social");
            List<String> roleNames = (List<String>) claims.get("roleNames");

            MemberDto memberDto = new MemberDto(email, pw, nickname, social.booleanValue(), roleNames);

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(memberDto,
                    pw, memberDto.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));

            response.setContentType("application/json");
            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();
        }

    }

}
