package location

import "context"

type Repository interface {
	SaveLocation(ctx context.Context, loc Location) error
	FindLocationById(ctx context.Context, supplierId string) (*Location, error)
}
