package org.spring.moviepj.util;

public class HangulUtils {

    private static final char[] CHO_SUNG = { 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' };

    public static String getChosung(String text) {
        StringBuilder result = new StringBuilder();
        for (char ch : text.toCharArray()) {
            if (ch >= '가' && ch <= '힣') {
                int index = (ch - '가') / 588; // 초성 인덱스 계산
                result.append(CHO_SUNG[index]);
            } else {
                result.append(ch); // 한글이 아니면 그대로 추가
            }
        }
        return result.toString();
    }
}
