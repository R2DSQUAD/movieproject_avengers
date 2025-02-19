package org.spring.moviepj.service.impl;

import org.spring.moviepj.dto.TheaterDto;
import org.spring.moviepj.entity.TheaterEntity;
import org.spring.moviepj.repository.TheaterRepository;
import org.spring.moviepj.service.TheaterService;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TheaterServiceImpl implements TheaterService {

    private final TheaterRepository theaterRepository;

}
