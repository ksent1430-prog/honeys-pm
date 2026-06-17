"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Bed, Bath, Maximize, MapPin, Search } from "lucide-react";
import Link from "next/link";

// Mock data for initial UI
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    address: "123 Main St, Springfield",
    price: 1850,
    beds: 2,
    baths: 2,
    sqft: 1100,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  },
  {
    id: 2,
    title: "Cozy Suburban House",
    address: "456 Oak Lane, Springfield",
    price: 2400,
    beds: 3,
    baths: 2.5,
    sqft: 1800,
    type: "House",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
  },
  {
    id: 3,
    title: "Luxury Condo with View",
    address: "789 Skyline Blvd, Springfield",
    price: 3200,
    beds: 2,
    baths: 2,
    sqft: 1350,
    type: "Condo",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  },
  {
    id: 4,
    title: "Charming Townhome",
    address: "101 Heritage Sq, Springfield",
    price: 2100,
    beds: 3,
    baths: 2,
    sqft: 1550,
    type: "Townhouse",
    image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80",
  },
  {
    id: 5,
    title: "Studio Near Campus",
    address: "202 University Dr, Springfield",
    price: 1100,
    beds: 1,
    baths: 1,
    sqft: 550,
    type: "Studio",
    image: "https://images.unsplash.com/photo-1536376074432-8d642fedd71b?w=800&q=80",
  },
  {
    id: 6,
    title: "Spacious Family Home",
    address: "303 Pinecrest Rd, Springfield",
    price: 2850,
    beds: 4,
    baths: 3,
    sqft: 2400,
    type: "House",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
  },
];

export default function PropertiesPage() {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = MOCK_PROPERTIES.filter(property => {
    const matchesType = filterType === "all" || property.type === filterType;
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header section */}
      <section className="py-16 bg-slate-50 border-b">
        <div className="container px-4 md:px-6 mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Available Properties
          </h1>
          <p className="max-w-[600px] text-muted-foreground text-lg">
            Find your next home in our curated selection of high-quality rentals.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b sticky top-16 bg-white z-40">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by address or title..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="House">Houses</SelectItem>
                  <SelectItem value="Apartment">Apartments</SelectItem>
                  <SelectItem value="Condo">Condos</SelectItem>
                  <SelectItem value="Townhouse">Townhouses</SelectItem>
                  <SelectItem value="Studio">Studios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">Reset Filters</Button>
          </div>
        </div>
      </section>

      {/* Property Grid */}
      <section className="py-16 flex-1">
        <div className="container px-4 md:px-6 mx-auto">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border rounded-2xl bg-slate-50">
              <h3 className="text-xl font-bold mb-2">No properties found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              <Button 
                variant="link" 
                onClick={() => {setSearchQuery(""); setFilterType("all");}}
                className="mt-4"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PropertyCard({ property }: { property: typeof MOCK_PROPERTIES[0] }) {
  return (
    <div className="group rounded-2xl border bg-white overflow-hidden hover:shadow-md transition-all">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
          ${property.price}/mo
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
          {property.type}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1 truncate">{property.title}</h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
          <MapPin className="w-3 h-3" />
          {property.address}
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm font-medium">
              <Bed className="w-4 h-4 text-primary" />
              {property.beds}
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Bath className="w-4 h-4 text-primary" />
              {property.baths}
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Maximize className="w-4 h-4 text-primary" />
              {property.sqft}
            </div>
          </div>
          <Button size="sm" asChild>
            <Link href={`/contact?property=${property.id}`}>Inquire</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
