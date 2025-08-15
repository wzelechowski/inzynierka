package pizzeria.menu.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pizzeria.menu.mapper.ExtraMapper;
import pizzeria.menu.model.Extra;
import pizzeria.menu.payloads.request.ExtraPatchRequest;
import pizzeria.menu.payloads.request.ExtraRequest;
import pizzeria.menu.repository.ExtraRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ExtraServiceImpl implements ExtraService {
    private final ExtraRepository extraRepository;
    private final ExtraMapper extraMapper;

    public ExtraServiceImpl(ExtraRepository extraRepository, ExtraMapper extraMapper) {
        this.extraRepository = extraRepository;
        this.extraMapper = extraMapper;
    }

    @Override
    public List<Extra> getAllExtras() {
        return extraRepository.findAll();
    }

    @Override
    public Optional<Extra> getExtraById(Long id) {
        return extraRepository.findById(id);
    }

    @Override
    @Transactional
    public Extra save(ExtraRequest request) {
        Extra extra = extraMapper.toEntity(request);
        return extraRepository.save(extra);
    }

    @Override
    @Transactional
    public Optional<Extra> delete(Long id) {
        Optional<Extra> extra = extraRepository.findById(id);
        extra.ifPresent(extraRepository::delete);
        return extra;
    }

    @Override
    @Transactional
    public Optional<Extra> update(Long id, ExtraRequest request) {
        return extraRepository.findById(id)
                .map(extra -> {
                    extraMapper.updateEntity(extra, request);
                    return extraRepository.save(extra);
                });
    }

    @Override
    @Transactional
    public Optional<Extra> patch(Long id, ExtraPatchRequest request) {
        return extraRepository.findById(id)
                .map(extra -> {
                    if (request.name() != null) {
                        extra.setName(request.name());
                    }
                    if (request.price() != null) {
                        extra.setPrice(request.price());
                    }
                    return extraRepository.save(extra);
                });
    }
}
