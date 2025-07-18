export default function CarCard({ car }) {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-semibold">{car.brand} {car.model}</h2>
      <p>Bouwjaar: {car.year}</p>
      <p>Prijs: €{car.price}</p>
    </div>
  );
}