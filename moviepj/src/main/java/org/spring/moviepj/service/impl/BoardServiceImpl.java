package org.spring.moviepj.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.spring.moviepj.dto.BoardDto;
import org.spring.moviepj.dto.BoardImgDto;
import org.spring.moviepj.entity.BoardEntity;
import org.spring.moviepj.entity.BoardImgEntity;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.repository.BoardImgRepository;
import org.spring.moviepj.repository.BoardRepository;
import org.spring.moviepj.repository.MemberRepository;
import org.spring.moviepj.service.BoardService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardServiceImpl implements BoardService {
    private final BoardRepository boardRepository;
    private final BoardImgRepository boardImgRepository;
    private final MemberRepository memberRepository;
    @Override
    public void boardInsert(BoardDto boardDto) throws IOException {

        Optional<MemberEntity> optionalMemberEntity=
                memberRepository.findByEmail(boardDto.getEmail());
        if(!optionalMemberEntity.isPresent()){
            throw new IllegalArgumentException("회원 x");
        }
        if(boardDto.getItemFile()==null){
            BoardEntity boardEntity= BoardEntity.toInsertBoardEntity(boardDto);
            boardRepository.save(boardEntity);
        }else{
            MultipartFile file= boardDto.getItemFile();

            String oldImgName= file.getOriginalFilename();

            UUID uuid= UUID.randomUUID();
            String newImgName=uuid+"_"+oldImgName;

            String saveFilePath="E:/saveFiles/"+newImgName;

            file.transferTo(new File(saveFilePath));

            //저장 (상품 테이블)

            BoardEntity boardEntity=BoardEntity.toFileInsertBoardEntity(boardDto);
            Long boardId=boardRepository.save(boardEntity).getId();

            System.out.println(boardId);
            Optional<BoardEntity> optionalBoardEntity1=boardRepository.findById(boardId);
            if(!optionalBoardEntity1.isPresent()){
                throw new IllegalArgumentException("fail");
            }

            //이미지 저장 (상품이미지 테이블)
            BoardImgDto boardImgDto = BoardImgDto.builder().newImgName(newImgName).oldImgName(oldImgName)
                    .boardEntity(optionalBoardEntity1.get()).build();

            BoardImgEntity boardImgEntity= BoardImgEntity.toBoardImgEntity(boardImgDto);

            boardImgRepository.save(boardImgEntity);

        }
    }

    @Override
    public List<BoardDto> boardList() {
        List<BoardEntity> boardEntities= boardRepository.findAll();
//        List<ItemDto> itemDtos= new ArrayList<>();
        // if(boardEntities.isEmpty()){
        //     throw new NullPointerException("목록X");
        // }


        return boardEntities.stream().map(BoardDto::toBoardDto).collect(Collectors.toList());
    }

    @Override
    public BoardDto detail(Long id) {
        Optional<BoardEntity> optionalBoardEntity= boardRepository.findById(id);
        if(!optionalBoardEntity.isPresent()){
            throw new IllegalArgumentException("id x");
        }
//        ItemEntity itemEntity=itemRepository.findById(id).orElseThrow(()->{
//        throw new IllegalArgumentException("id x");  });
//        ItemEntity itemEntity=itemRepository.findById(id).orElseThrow(IllegalArgumentException::new);
        updateHit(id);
        return BoardDto.toBoardDto(optionalBoardEntity.get());
    }

    @Override
public void boardUpdate(BoardDto boardDto) throws IOException {
    // 1. 게시글 확인
    Optional<BoardEntity> optionalBoardEntity = boardRepository.findById(boardDto.getId());
    if (!optionalBoardEntity.isPresent()) {
        throw new IllegalArgumentException("Fail!-> 상품 !");
    }
    
    // 2. 파일 체크
    Optional<BoardImgEntity> optionalBoardImgEntity = 
        boardImgRepository.findByBoardEntity(BoardEntity.builder().id(boardDto.getId()).build());
    
    if (optionalBoardImgEntity.isPresent()) {
        String newImgName = optionalBoardImgEntity.get().getNewImgName();
        String saveFilePath = "E:/saveFiles/" + newImgName; // 로컬 저장이름
        File deleteFile = new File(saveFilePath);
        if (deleteFile.exists()) {
            deleteFile.delete(); // 파일 삭제 -> 로컬 파일 삭제
            System.out.println("파일을 삭제하였습니다.");
        } else {
            System.out.println("파일이 존재하지 않습니다.");
        }
        // DB파일 삭제
        boardImgRepository.deleteById(optionalBoardImgEntity.get().getId());
    }

    // 3. 게시글 수정
    Optional<MemberEntity> optionalMemberEntity = memberRepository.findByEmail(boardDto.getEmail());
    if (!optionalMemberEntity.isPresent()) {
        throw new IllegalArgumentException("Fail -> 회원아이디!");
    }

    // 파일이 없을 경우와 있을 경우에 따라 처리
    MultipartFile itemFile = boardDto.getItemFile(); // 파일을 받음

    // 파일이 null이거나 비어있으면 게시글만 수정
    if (itemFile == null || itemFile.isEmpty()) {
        BoardEntity boardEntity = BoardEntity.toUpdateBoardEntity(boardDto);
        boardRepository.save(boardEntity);
        System.out.println("파일 없이 게시글만 수정되었습니다.");
    } else {
        // 파일이 있을 경우에는 새로 저장
        String oldImgName = itemFile.getOriginalFilename(); // 원본이미지명
        System.out.println("원본이미지: " + oldImgName);
        UUID uuid = UUID.randomUUID();
        String newImgName = uuid + "_" + oldImgName;
        System.out.println("newImgName: " + newImgName);
        String saveFilePath = "E:/saveFiles/" + newImgName; // 로컬 저장이름
        itemFile.transferTo(new File(saveFilePath)); // 로컬 저장

        // 게시글 정보 업데이트
        BoardEntity boardEntity = BoardEntity.toUpdateFileBoardEntity(boardDto);
        Long itemId = boardRepository.save(boardEntity).getId();
        
        // 상품 이미지 정보 저장 (이미지 테이블)
        Optional<BoardEntity> optionalBoardEntity2 = boardRepository.findById(itemId);
        if (!optionalBoardEntity2.isPresent()) {
            throw new IllegalArgumentException("Fail!-> 상품 !");
        }
        
        BoardImgDto boardImgDto = BoardImgDto.builder()
            .newImgName(newImgName)
            .oldImgName(oldImgName)
            .boardEntity(optionalBoardEntity2.get())
            .build();
        
        BoardImgEntity boardImgEntity = BoardImgEntity.toBoardImgEntity(boardImgDto);
        Long boardId2 = boardImgRepository.save(boardImgEntity).getId();
        updateHit(boardId2); // 조회수 업데이트
    }
}
@Override
public int replyCount(Long id) {
   return boardRepository.boardReplyCount(id);
//        return 0;
}
    
    @Override
    public void updateHit(Long id) {
        boardRepository.updateHit(id);
    }

    @Override
    public void boardDelete(Long id) {
        Optional<BoardEntity>optionalItemEntity=boardRepository.findById(id);
        if(!optionalItemEntity.isPresent()){
            throw new IllegalArgumentException("삭제할 상품이 x");
        }
        boardRepository.deleteById(id);
    }

    public void updateBoardReplyCount(BoardDto boardDto) {
        BoardEntity boardEntity = boardRepository.findById(boardDto.getId())
        .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

    boardEntity.setReplyCount(boardDto.getReplyCount());
    boardRepository.save(boardEntity);  // DB에 업데이트
    }
}
