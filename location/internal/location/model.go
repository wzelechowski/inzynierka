package location

type Location struct {
	SupplierId string  `bson:"supplierId"`
	Lat        float64 `bson:"lat"`
	Lng        float64 `bson:"lng"`
}
