'use client';

import { useState } from 'react';

export type StockCategory = 'All' | 'Draught' | 'Spirit' | 'Food' | 'Consumables';

export interface StockItem {
  id: string;
  name: string;
  category: StockCategory;
  currentStock: number;
  nominalStock: number;
  supplier?: string;
  type?: string;
}

// Sample stock items
const sampleStockItems: StockItem[] = [
  // Draught beers
  { id: '1', name: 'Carlsberg Keg', category: 'Draught', currentStock: 3, nominalStock: 5, type: 'Keg', supplier: 'Carlsberg UK' },
  { id: '2', name: 'Guinness Keg', category: 'Draught', currentStock: 2, nominalStock: 4, type: 'Keg', supplier: 'Diageo' },
  { id: '3', name: 'Peroni Keg', category: 'Draught', currentStock: 4, nominalStock: 6, type: 'Keg', supplier: 'Asahi' },
  { id: '4', name: 'Thatchers Gold Keg', category: 'Draught', currentStock: 1, nominalStock: 3, type: 'Keg', supplier: 'Thatchers Cider' },
  { id: '5', name: 'Stella Artois Keg', category: 'Draught', currentStock: 5, nominalStock: 7, type: 'Keg', supplier: 'AB InBev' },
  
  // Spirits
  { id: '6', name: 'Vodka Smirnoff', category: 'Spirit', currentStock: 2, nominalStock: 4, type: 'Bottle', supplier: 'Diageo' },
  { id: '7', name: 'Gin Bombay Sapphire', category: 'Spirit', currentStock: 3, nominalStock: 5, type: 'Bottle', supplier: 'Bacardi' },
  { id: '8', name: 'Rum Bacardi', category: 'Spirit', currentStock: 1, nominalStock: 3, type: 'Bottle', supplier: 'Bacardi' },
  { id: '9', name: 'Whiskey Jack Daniels', category: 'Spirit', currentStock: 4, nominalStock: 6, type: 'Bottle', supplier: 'Brown-Forman' },
  { id: '10', name: 'Tequila Jose Cuervo', category: 'Spirit', currentStock: 2, nominalStock: 4, type: 'Bottle', supplier: 'Becle' },
  
  // Food
  { id: '11', name: 'Chips (Case)', category: 'Food', currentStock: 8, nominalStock: 12, type: 'Case', supplier: 'McCain' },
  { id: '12', name: 'Burger Buns (Pack)', category: 'Food', currentStock: 6, nominalStock: 10, type: 'Pack', supplier: 'Warburtons' },
  { id: '13', name: 'Chicken Wings (Kg)', category: 'Food', currentStock: 3, nominalStock: 5, type: 'Pack', supplier: 'Local Butcher' },
  { id: '14', name: 'Nachos (Case)', category: 'Food', currentStock: 5, nominalStock: 8, type: 'Case', supplier: 'Tyrrells' },
  
  // Consumables
  { id: '15', name: 'Napkins (Box)', category: 'Consumables', currentStock: 4, nominalStock: 8, type: 'Box', supplier: 'Kimberly-Clark' },
  { id: '16', name: 'Cleaning Spray', category: 'Consumables', currentStock: 2, nominalStock: 4, type: 'Bottle', supplier: 'Diversey' },
  { id: '17', name: 'Bin Liners (Roll)', category: 'Consumables', currentStock: 3, nominalStock: 6, type: 'Roll', supplier: 'Polybags Ltd' },
  { id: '18', name: 'Toilet Paper (Case)', category: 'Consumables', currentStock: 7, nominalStock: 10, type: 'Case', supplier: 'Essity' },
];

const categoryColors: Record<StockCategory, { bg: string; border: string; text: string }> = {
  All: { bg: 'rgba(156, 163, 175, 0.15)', border: 'rgba(156, 163, 175, 0.4)', text: '#9ca3af' },
  Draught: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)', text: '#3b82f6' },
  Spirit: { bg: 'rgba(147, 51, 234, 0.15)', border: 'rgba(147, 51, 234, 0.4)', text: '#9333ea' },
  Food: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.4)', text: '#22c55e' },
  Consumables: { bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.4)', text: '#f97316' },
};

export default function Stock() {
  const [stockItems, setStockItems] = useState<StockItem[]>(sampleStockItems);
  const [selectedCategory, setSelectedCategory] = useState<StockCategory>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'Keg',
    nominalStock: 1,
    supplier: '',
    category: 'Draught' as StockCategory,
  });
  const [submittedCategories, setSubmittedCategories] = useState<Set<StockCategory>>(new Set());

  // Group items by category (excluding 'All')
  const groupedItems = stockItems.reduce((acc, item) => {
    if (item.category !== 'All') {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
    }
    return acc;
  }, {} as Record<StockCategory, StockItem[]>);

  // Get categories that actually have items
  const categoriesWithItems = Object.keys(groupedItems) as StockCategory[];

  // Filter items based on selected category (for backward compatibility)
  const filteredItems = selectedCategory === 'All' 
    ? stockItems 
    : stockItems.filter(item => item.category === selectedCategory);

  const handleCategorySelect = (category: StockCategory) => {
    setSelectedCategory(category);
  };

  const handleIncrement = (id: string) => {
    setStockItems(prev => prev.map(item => 
      item.id === id ? { ...item, currentStock: item.currentStock + 1 } : item
    ));
  };

  const handleDecrement = (id: string) => {
    setStockItems(prev => prev.map(item => 
      item.id === id ? { ...item, currentStock: Math.max(0, item.currentStock - 1) } : item
    ));
  };

  const handleInputChange = (id: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setStockItems(prev => prev.map(item => 
      item.id === id ? { ...item, currentStock: Math.max(0, numValue) } : item
    ));
  };

  // Calculate stock status
  const getStockStatus = (current: number, nominal: number) => {
    if (current === 0) return 'out-of-stock';
    if (current < nominal * 0.3) return 'low';
    if (current < nominal) return 'warning';
    return 'good';
  };

  // Add new item handlers
  const handleFormChange = (field: string, value: string | number) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    if (!newItem.name.trim() || newItem.nominalStock < 1) return;
    
    const newStockItem: StockItem = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category,
      currentStock: 0,
      nominalStock: newItem.nominalStock,
      type: newItem.type,
      supplier: newItem.supplier,
    };
    
    setStockItems(prev => [...prev, newStockItem]);
    setNewItem({
      name: '',
      type: 'Keg',
      nominalStock: 1,
      supplier: '',
      category: 'Draught',
    });
    setShowAddForm(false);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    setNewItem({
      name: '',
      type: 'Keg',
      nominalStock: 1,
      supplier: '',
      category: 'Draught',
    });
  };

  // Handle submit for a specific category
  const handleSubmitCategory = async (category: StockCategory, items: StockItem[]) => {
    console.log(`Submitting ${category} stock:`, items.map(item => ({
      id: item.id,
      name: item.name,
      currentStock: item.currentStock,
      nominalStock: item.nominalStock
    })));
    
    // Calculate deficits for items where currentStock < nominalStock
    const deficitItems = items
      .filter(item => item.currentStock < item.nominalStock)
      .map(item => ({
        name: item.name,
        category: item.category,
        quantityNeeded: item.nominalStock - item.currentStock,
        supplier: item.supplier || 'Unknown',
        purchased: false
      }));
    
    console.log(`Deficit items for ${category}:`, deficitItems);
    
    // Mark category as submitted
    setSubmittedCategories(prev => new Set(prev).add(category));
    
    // If no deficits, show success and return early
    if (deficitItems.length === 0) {
      alert(`${category} stock submitted successfully! All items are adequately stocked.`);
      return;
    }
    
    try {
      // POST deficit items to shopping API
      const response = await fetch('http://localhost:3000/api/staff-board/shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: deficitItems }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API response:', result);
      
      if (result.success) {
        alert(`${category} stock submitted successfully! ${deficitItems.length} item(s) added to shopping list.`);
      } else {
        alert(`${category} stock submitted, but there was an issue with the shopping list API: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting to shopping API:', error);
      alert(`${category} stock submitted locally, but failed to update shopping list. Please check your connection.`);
    }
    
    // Optional: Reset counts for submitted category
    // setStockItems(prev => prev.map(item => 
    //   item.category === category ? { ...item, currentStock: 0 } : item
    // ));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Stock Take</h1>
        <p className="text-white/60">The Catherine Wheel • Update stock levels</p>
      </div>

      {/* Category filter pills - Hidden but kept for backward compatibility */}
      <div className="mb-8 hidden">
        <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2">
          {(Object.keys(categoryColors) as StockCategory[]).map(category => {
            const colors = categoryColors[category];
            return (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-6 py-3 rounded font-medium border transition-all whitespace-nowrap ${
                  selectedCategory === category 
                    ? 'scale-105 shadow-lg' 
                    : 'opacity-80 hover:opacity-100 hover:scale-105'
                }`}
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  color: colors.text,
                }}
              >
                {category}
                {category !== 'All' && (
                  <span className="ml-2 text-xs opacity-70">
                    ({stockItems.filter(item => item.category === category).length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Stock Item button */}
      <div className="mb-8">
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 rounded font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: '1px solid rgba(59, 130, 246, 0.4)',
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Stock Item
        </button>
      </div>

      {/* Add Stock Item Form */}
      {showAddForm && (
        <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4">Add New Stock Item</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Name *</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter item name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Type</label>
                <select
                  value={newItem.type}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Keg">Keg</option>
                  <option value="Bottle">Bottle</option>
                  <option value="Case">Case</option>
                  <option value="Pack">Pack</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Full Stock (Nominal) *</label>
                <input
                  type="number"
                  value={newItem.nominalStock}
                  onChange={(e) => handleFormChange('nominalStock', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter nominal stock"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Supplier</label>
                <input
                  type="text"
                  value={newItem.supplier}
                  onChange={(e) => handleFormChange('supplier', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter supplier name"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Category *</label>
                <select
                  value={newItem.category}
                  onChange={(e) => handleFormChange('category', e.target.value as StockCategory)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Draught">Draught</option>
                  <option value="Spirit">Spirit</option>
                  <option value="Food">Food</option>
                  <option value="Consumables">Consumables</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddItem}
                disabled={!newItem.name.trim() || newItem.nominalStock < 1}
                className="px-6 py-3 rounded font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                }}
              >
                Add Item
              </button>
              
              <button
                onClick={handleCloseAddForm}
                className="px-6 py-3 rounded font-medium transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Sections */}
      {categoriesWithItems.length > 0 ? (
        categoriesWithItems.map(category => {
          const colors = categoryColors[category];
          const categoryItems = groupedItems[category];
          const isSubmitted = submittedCategories.has(category);
          
          return (
            <section key={category} className="mb-12">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 
                    className="text-2xl font-bold text-white px-4 py-2 rounded font-medium border whitespace-nowrap"
                    style={{
                      backgroundColor: colors.bg,
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                  >
                    {category}
                  </h2>
                  <span className="text-white/60">
                    {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                  </span>
                  {isSubmitted && (
                    <span className="px-3 py-1 rounded text-sm font-medium bg-green-500/20 border border-green-500/40 text-green-400">
                      ✓ Submitted
                    </span>
                  )}
                </div>
              </div>
              
              {/* Category Items List */}
              <div className="space-y-4 mb-8">
                {categoryItems.map(item => {
                  const stockStatus = getStockStatus(item.currentStock, item.nominalStock);
                  const statusColors = {
                    'out-of-stock': { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' },
                    'low': { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: '#f59e0b' },
                    'warning': { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.3)', text: '#eab308' },
                    'good': { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e' },
                  };
                  const statusText = {
                    'out-of-stock': 'Out of stock',
                    'low': 'Very low',
                    'warning': 'Low',
                    'good': 'Good',
                  };

                  return (
                    <div 
                      key={item.id}
                      className="w-full p-5 rounded-2xl backdrop-blur-sm border transition-all hover:scale-[1.01] overflow-hidden box-border"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Left side: Item info */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                            <span 
                              className="px-3 py-1 rounded text-sm font-medium border whitespace-nowrap"
                              style={{
                                backgroundColor: colors.bg,
                                borderColor: colors.border,
                                color: colors.text,
                              }}
                            >
                              {item.category}
                            </span>
                            <span 
                              className="px-2 py-1 rounded text-xs font-medium border"
                              style={{
                                backgroundColor: statusColors[stockStatus].bg,
                                borderColor: statusColors[stockStatus].border,
                                color: statusColors[stockStatus].text,
                              }}
                            >
                              {statusText[stockStatus]}
                            </span>
                          </div>
                          
                          {/* Item details */}
                          <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm mb-4">
                            <span>
                              <span className="font-medium">Nominal:</span> {item.nominalStock}
                            </span>
                            {item.type && (
                              <span>
                                <span className="font-medium">Type:</span> {item.type}
                              </span>
                            )}
                            {item.supplier && (
                              <span>
                                <span className="font-medium">Supplier:</span> {item.supplier}
                              </span>
                            )}
                          </div>
                          
                          {/* Stock level indicator */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white/70 text-sm">Stock level</span>
                              <span className="text-white/70 text-sm">
                                {item.currentStock} / {item.nominalStock}
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min(100, (item.currentStock / item.nominalStock) * 100)}%`,
                                  backgroundColor: stockStatus === 'out-of-stock' ? '#ef4444' : 
                                                  stockStatus === 'low' ? '#f59e0b' : 
                                                  stockStatus === 'warning' ? '#eab308' : '#22c55e',
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right side: Stock controls */}
                        <div className="flex items-center gap-2 justify-end md:justify-start">
                          {/* Decrement button */}
                          <button
                            onClick={() => handleDecrement(item.id)}
                            className="w-12 h-12 rounded flex items-center justify-center transition-all hover:scale-110 active:scale-95 box-border overflow-hidden"
                            style={{
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              color: '#ef4444',
                            }}
                            aria-label={`Decrease ${item.name} stock`}
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                          </button>

                          {/* Stock input */}
                          <div className="relative">
                            <input
                              type="number"
                              value={item.currentStock}
                              onChange={(e) => handleInputChange(item.id, e.target.value)}
                              min="0"
                              className="w-28 px-4 py-3 rounded-xl text-center text-white font-bold text-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                              aria-label={`Current stock for ${item.name}`}
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>

                          {/* Increment button */}
                          <button
                            onClick={() => handleIncrement(item.id)}
                            className="w-12 h-12 rounded flex items-center justify-center transition-all hover:scale-110 active:scale-95 box-border overflow-hidden"
                            style={{
                              backgroundColor: 'rgba(34, 197, 94, 0.15)',
                              border: '1px solid rgba(34, 197, 94, 0.4)',
                              color: '#22c55e',
                            }}
                            aria-label={`Increase ${item.name} stock`}
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Submit Button for this Category */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => handleSubmitCategory(category, categoryItems)}
                  disabled={isSubmitted}
                  className="px-8 py-4 rounded font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                  }}
                >
                  {isSubmitted ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {category} Stock Submitted
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Submit Stock Take for {category}
                    </>
                  )}
                </button>
              </div>
            </section>
          );
        })
      ) : (
        <div className="text-center py-16 rounded-2xl bg-white/5 border border-white/10">
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No stock items found</h3>
          <p className="text-white/60 max-w-md mx-auto">
            No stock items in any category.
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Total Items</h3>
            <p className="text-3xl font-bold text-white">{stockItems.length}</p>
            <p className="text-white/60 text-sm mt-1">Items across all categories</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Low Stock</h3>
            <p className="text-3xl font-bold text-yellow-400">
              {stockItems.filter(item => getStockStatus(item.currentStock, item.nominalStock) === 'low' || getStockStatus(item.currentStock, item.nominalStock) === 'warning').length}
            </p>
            <p className="text-white/60 text-sm mt-1">Items needing restock</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Out of Stock</h3>
            <p className="text-3xl font-bold text-red-400">
              {stockItems.filter(item => getStockStatus(item.currentStock, item.nominalStock) === 'out-of-stock').length}
            </p>
            <p className="text-white/60 text-sm mt-1">Items completely out</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-white/40 text-sm">
            Stock Take • The Catherine Wheel • {new Date().toLocaleDateString()}
          </p>
          <p className="text-white/30 text-xs mt-2">
            Categories: {categoriesWithItems.length} • Items: {stockItems.length}
          </p>
        </div>
      </div>
    </div>
  );
}