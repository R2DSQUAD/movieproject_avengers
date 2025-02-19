package org.spring.moviepj.config;


import org.spring.moviepj.common.Role;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.SortedMap;

@Service
public class MyDefaultOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User=super.loadUser(userRequest);

        ClientRegistration clientRegistration=userRequest.getClientRegistration();
        System.out.println(clientRegistration);
        String clientId=clientRegistration.getClientId();
        System.out.println(clientId);
        String registrationId=clientRegistration.getRegistrationId();
        System.out.println(registrationId);
        // google, naver
        Map<String,Object>attributes=oAuth2User.getAttributes();


        return oAuth2UserSuccess(oAuth2User,registrationId);
    }

    private OAuth2User oAuth2UserSuccess(OAuth2User oAuth2User, String registrationId) {
        String userEmail="";
        String userPw="";
        String userName="";

        if(registrationId.equals("google")){
            userEmail=oAuth2User.getAttribute("email");
            userName=oAuth2User.getAttribute("name");
        }else if(registrationId.equals("naver")){
            Map<String,Object> response=(Map<String,Object>) oAuth2User.getAttributes().get("response");

            userEmail=(String) response.get("email");
            userName=(String) response.get("name");

        }else if(registrationId.equals("kakao")){
            Map<String,Object> kakao_account=(Map<String, Object>) oAuth2User.getAttributes().get("kakao_account");
            Map<String,Object> profile= (Map<String, Object>) kakao_account.get("profile");

            System.out.println(kakao_account+"kakao_account");
            System.out.println(profile+"profile");

            userEmail=(String) kakao_account.get("email");
            userName=(String) profile.get("nickname");
        }
        Optional<MemberEntity>optionalMemberEntity=memberRepository.findByUserEmail(userEmail);
        if(optionalMemberEntity.isPresent()){
            return new MyUserDetails(optionalMemberEntity.get());
        }
        userPw=passwordEncoder.encode("ffff");
        MemberEntity memberEntity=memberRepository.save(
                MemberEntity.builder()
                        .userEmail(userEmail)
                        .userPw(userPw)
                        .userName(userName)
                        .role(Role.MEMBER)
                        .build()
        );
        return new MyUserDetails(memberEntity,oAuth2User.getAttributes());
    }
}
