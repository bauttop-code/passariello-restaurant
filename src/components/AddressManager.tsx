import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MapPin, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { Badge } from './ui/badge';

export interface SavedAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

interface AddressManagerProps {
  addresses: SavedAddress[];
  onAddressesChange: (addresses: SavedAddress[]) => void;
}

export function AddressManager({ addresses, onAddressesChange }: AddressManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formLabel, setFormLabel] = useState('');
  const [formStreet, setFormStreet] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('NJ');
  const [formZip, setFormZip] = useState('');

  const resetForm = () => {
    setFormLabel('');
    setFormStreet('');
    setFormCity('');
    setFormState('NJ');
    setFormZip('');
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (address: SavedAddress) => {
    setFormLabel(address.label);
    setFormStreet(address.street);
    setFormCity(address.city);
    setFormState(address.state);
    setFormZip(address.zip);
    setEditingId(address.id);
    setIsAdding(false);
  };

  const handleSaveNew = () => {
    if (!formLabel.trim() || !formStreet.trim() || !formCity.trim() || !formZip.trim()) {
      return;
    }

    const newAddress: SavedAddress = {
      id: `addr_${Date.now()}`,
      label: formLabel.trim(),
      street: formStreet.trim(),
      city: formCity.trim(),
      state: formState,
      zip: formZip.trim(),
      isDefault: addresses.length === 0, // First address is default
    };

    onAddressesChange([...addresses, newAddress]);
    setIsAdding(false);
    resetForm();
  };

  const handleSaveEdit = () => {
    if (!editingId || !formLabel.trim() || !formStreet.trim() || !formCity.trim() || !formZip.trim()) {
      return;
    }

    const updatedAddresses = addresses.map(addr => 
      addr.id === editingId
        ? {
            ...addr,
            label: formLabel.trim(),
            street: formStreet.trim(),
            city: formCity.trim(),
            state: formState,
            zip: formZip.trim(),
          }
        : addr
    );

    onAddressesChange(updatedAddresses);
    setEditingId(null);
    resetForm();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const addressToDelete = addresses.find(a => a.id === id);
    const wasDefault = addressToDelete?.isDefault;
    
    let updatedAddresses = addresses.filter(addr => addr.id !== id);
    
    // If we deleted the default address, make the first remaining address default
    if (wasDefault && updatedAddresses.length > 0) {
      updatedAddresses = updatedAddresses.map((addr, index) => ({
        ...addr,
        isDefault: index === 0,
      }));
    }

    onAddressesChange(updatedAddresses);
  };

  const handleSetDefault = (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    onAddressesChange(updatedAddresses);
  };

  return (
    <div className="space-y-4">
      {/* Address List */}
      <div className="space-y-2">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`border rounded-lg p-4 ${
              editingId === address.id ? 'border-[#A72020] bg-red-50' : 'hover:border-gray-300'
            }`}
          >
            {editingId === address.id ? (
              // Edit Form
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor={`edit-label-${address.id}`}>Address Label</Label>
                  <Input
                    id={`edit-label-${address.id}`}
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder="Home, Work, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-street-${address.id}`}>Street Address</Label>
                  <Input
                    id={`edit-street-${address.id}`}
                    value={formStreet}
                    onChange={(e) => setFormStreet(e.target.value)}
                    placeholder="123 Main St"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-city-${address.id}`}>City</Label>
                    <Input
                      id={`edit-city-${address.id}`}
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      placeholder="Haddonfield"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`edit-state-${address.id}`}>State</Label>
                    <Input
                      id={`edit-state-${address.id}`}
                      value={formState}
                      onChange={(e) => setFormState(e.target.value)}
                      placeholder="NJ"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-zip-${address.id}`}>ZIP Code</Label>
                  <Input
                    id={`edit-zip-${address.id}`}
                    value={formZip}
                    onChange={(e) => setFormZip(e.target.value)}
                    placeholder="08033"
                    maxLength={5}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveEdit}
                    size="sm"
                    className="flex-1 bg-[#A72020] hover:bg-[#8B1818]"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // Display View
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <MapPin className="w-5 h-5 text-[#A72020] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{address.label}</span>
                      {address.isDefault && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {address.street}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.zip}
                    </p>
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="text-xs text-[#A72020] hover:underline mt-1"
                      >
                        Set as default
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStartEdit(address)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Address Form */}
      {isAdding ? (
        <div className="border border-[#A72020] rounded-lg p-4 bg-red-50 space-y-3">
          <h4 className="font-semibold">Add New Address</h4>
          
          <div className="space-y-2">
            <Label htmlFor="new-label">Address Label</Label>
            <Input
              id="new-label"
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
              placeholder="Home, Work, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-street">Street Address</Label>
            <Input
              id="new-street"
              value={formStreet}
              onChange={(e) => setFormStreet(e.target.value)}
              placeholder="123 Main St"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="new-city">City</Label>
              <Input
                id="new-city"
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder="Haddonfield"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-state">State</Label>
              <Input
                id="new-state"
                value={formState}
                onChange={(e) => setFormState(e.target.value)}
                placeholder="NJ"
                maxLength={2}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-zip">ZIP Code</Label>
            <Input
              id="new-zip"
              value={formZip}
              onChange={(e) => setFormZip(e.target.value)}
              placeholder="08033"
              maxLength={5}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSaveNew}
              size="sm"
              className="flex-1 bg-[#A72020] hover:bg-[#8B1818]"
            >
              <Check className="w-4 h-4 mr-1" />
              Save Address
            </Button>
            <Button
              onClick={handleCancel}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        // Add Address Button
        <Button
          onClick={handleStartAdd}
          variant="outline"
          className="w-full border-dashed border-2 hover:border-[#A72020] hover:text-[#A72020]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>
      )}

      {addresses.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500 text-sm">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>No saved addresses yet</p>
          <p>Add your first delivery address above</p>
        </div>
      )}
    </div>
  );
}
