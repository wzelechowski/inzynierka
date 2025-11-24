package pizzeria.menu.extra.service;

import jakarta.transaction.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pizzeria.menu.extra.dto.response.ExtraResponse;
import pizzeria.menu.extra.mapper.ExtraMapper;
import pizzeria.menu.extra.model.Extra;
import pizzeria.menu.extra.dto.request.ExtraPatchRequest;
import pizzeria.menu.extra.dto.request.ExtraRequest;
import pizzeria.menu.extra.repository.ExtraRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExtraServiceImpl implements ExtraService {
    private final ExtraRepository extraRepository;
    private final ExtraMapper extraMapper;

    public ExtraServiceImpl(ExtraRepository extraRepository, ExtraMapper extraMapper) {
        this.extraRepository = extraRepository;
        this.extraMapper = extraMapper;
    }

    @Override
    @Cacheable(value = "extras")
    public List<ExtraResponse> getAllExtras() {
        return extraRepository.findAll()
                .stream()
                .map(extraMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "extra", key = "#id")
    public ExtraResponse getExtraById(UUID id) {
        Extra extra = extraRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        return  extraMapper.toResponse(extra);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "extra", key = "#result.id"),
            evict = @CacheEvict(value = "extras", allEntries = true)
    )
    public ExtraResponse save(ExtraRequest request) {
        Extra extra = extraMapper.toEntity(request);
        extraRepository.save(extra);
        return extraMapper.toResponse(extra);
    }

    @Override
    @Transactional
    @Caching(
            evict = {
                    @CacheEvict(value = "extra", key = "#id"),
                    @CacheEvict(value = "extras", allEntries = true)
            }
    )
    public void delete(UUID id) {
        Extra extra = extraRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        extraRepository.delete(extra);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "extra", key = "#result.id"),
            evict = @CacheEvict(value = "extras", allEntries = true)
    )
    public ExtraResponse update(UUID id, ExtraRequest request) {
        Extra extra = extraRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        extraMapper.updateEntity(extra, request);
        extraRepository.save(extra);
        return extraMapper.toResponse(extra);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "extra", key = "#result.id"),
            evict = @CacheEvict(value = "extras", allEntries = true)
    )
    public ExtraResponse patch(UUID id, ExtraPatchRequest request) {
        Extra extra = extraRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        extraMapper.patchEntity(extra, request);
        extraRepository.save(extra);
        return extraMapper.toResponse(extra);
    }
}
