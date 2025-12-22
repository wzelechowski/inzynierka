package location

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type RepositoryImpl struct {
	col *mongo.Collection
}

func NewRepository(uri, dbName, colName string) (*RepositoryImpl, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return nil, err
	}

	col := client.Database(dbName).Collection(colName)
	return &RepositoryImpl{col: col}, nil
}

func (repo *RepositoryImpl) SaveLocation(ctx context.Context, loc Location) error {
	_, err := repo.col.InsertOne(ctx, loc)
	return err
}

func (repo *RepositoryImpl) FindLocationById(ctx context.Context, supplierId string) (*Location, error) {
	var loc Location
	err := repo.col.FindOne(ctx, bson.M{"supplierId": supplierId}).Decode(&loc)
	return &loc, err
}
