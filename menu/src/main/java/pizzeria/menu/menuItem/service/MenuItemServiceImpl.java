package pizzeria.menu.menuItem.service;

import jakarta.transaction.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pizzeria.menu.menuItem.dto.request.MenuItemPatchRequest;
import pizzeria.menu.menuItem.dto.request.MenuItemRequest;
import pizzeria.menu.menuItem.dto.response.MenuItemResponse;
import pizzeria.menu.menuItem.mapper.MenuItemMapper;
import pizzeria.menu.menuItem.model.MenuItem;
import pizzeria.menu.menuItem.repository.MenuItemRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MenuItemServiceImpl implements MenuItemService {
    private final MenuItemRepository menuItemRepository;
    private final MenuItemMapper menuItemMapper;

    public MenuItemServiceImpl(MenuItemRepository menuItemRepository, MenuItemMapper menuItemMapper) {
        this.menuItemRepository = menuItemRepository;
        this.menuItemMapper = menuItemMapper;
    }


    @Override
    @Cacheable(value = "menuItems")
    public List<MenuItemResponse> getAllMenuItems() {
        return menuItemRepository.findAll()
                .stream()
                .map(menuItemMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuItemResponse> getAvailableMenuItems() {
        return menuItemRepository.findByIsAvailable(true)
                .stream()
                .map(menuItemMapper::toResponse)
                .toList();
    }

    @Override
    @Cacheable(value = "menuItem", key = "#id")
    public MenuItemResponse getMenuItemById(UUID id) {
        MenuItem menuItem = menuItemRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        return menuItemMapper.toResponse(menuItem);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "menuItem", key = "#result.id"),
            evict = @CacheEvict(value = "menuItems", allEntries = true)
    )
    public MenuItemResponse save(MenuItemRequest request) {
        MenuItem menuItem = menuItemMapper.toEntity(request);
        menuItemRepository.save(menuItem);
        return menuItemMapper.toResponse(menuItem);
    }

    @Override
    @Transactional
    @Caching(
            evict = {
                    @CacheEvict(value = "menuItem", key = "#id"),
                    @CacheEvict(value = "menuItems", allEntries = true)
            }
    )
    public void delete(UUID id) {
        MenuItem menuItem = menuItemRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        menuItemRepository.delete(menuItem);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "menuItem", key = "#result.id"),
            evict = @CacheEvict(value = "menuItems", allEntries = true)
    )
    public MenuItemResponse update(UUID id, MenuItemRequest request) {
        MenuItem menuItem = menuItemRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        menuItemMapper.updateEntity(menuItem, request);
        menuItemRepository.save(menuItem);
        return menuItemMapper.toResponse(menuItem);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "menuItem", key = "#result.id"),
            evict = @CacheEvict(value = "menuItems", allEntries = true)
    )
    public MenuItemResponse patch(UUID id, MenuItemPatchRequest request) {
        MenuItem menuItem = menuItemRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        menuItemMapper.patchEntity(menuItem, request);
        menuItemRepository.save(menuItem);
        return menuItemMapper.toResponse(menuItem);
    }
}
