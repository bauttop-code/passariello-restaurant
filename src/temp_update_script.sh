#!/bin/bash
# Script temporal para actualizar todas las instancias de ProductCard

sed -i 's/onChangeLocation={handleLocationClick} \/>/onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} \/>/g' /App.tsx
