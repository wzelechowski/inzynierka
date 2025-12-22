package location

import (
	"context"
	"sync"
)

type Service struct {
	mu        sync.RWMutex
	locations map[string]Location
	repo      Repository
}

func NewService(repo Repository) *Service {
	return &Service{
		locations: make(map[string]Location),
		repo:      repo,
	}
}

func (s *Service) Create(ctx context.Context, loc Location) error {
	s.mu.Lock()
	s.locations[loc.SupplierId] = loc
	s.mu.Unlock()

	return s.repo.SaveLocation(ctx, loc)
}

func (s *Service) GetLocation(ctx context.Context, supplierId string) (Location, error) {
	s.mu.RLock()
	loc, ok := s.locations[supplierId]
	s.mu.RUnlock()

	if ok {
		return loc, nil
	}

	dbLoc, err := s.repo.FindLocationById(ctx, supplierId)
	if err != nil {
		return Location{}, err
	}

	s.mu.Lock()
	s.locations[supplierId] = *dbLoc
	s.mu.Unlock()

	return *dbLoc, nil
}
