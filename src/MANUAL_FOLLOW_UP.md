# 🔧 MANUAL FOLLOW-UP: Casos con Template Strings o Lógica Dinámica

## ⚠️ Casos que NO están incluidos en el patch y requieren revisión manual

Estos banners usan `className={...}` con template strings o lógica condicional, por lo que no se incluyeron en el patch automático para evitar errores:

---

### 1. **Línea 8461: Catering Pasta Type Selector**
**Contexto:** Banner "1. Choose a Pasta Type" para productos cp7-cp11 (Catering Pasta with Sauce Trays)
```tsx
<button 
  ref={cateringPastaTypeRef}
  className={`w-full bg-[#A72020] text-white p-5 rounded-lg flex items-center justify-between ${
    cateringPastaTypeError ? 'ring-4 ring-red-500' : ''
  }`}
>
```

**Cambio sugerido:**
```tsx
<button 
  ref={cateringPastaTypeRef}
  className={`w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between ${
    cateringPastaTypeError ? 'ring-4 ring-red-500' : ''
  }`}
>
```

---

### 2. **Línea 8600: Catering Salad Base Selector**
**Contexto:** Banner "1. Choose a Base" para ensaladas de catering (cp12-cp16)
```tsx
<button 
  ref={cateringSaladBaseRef}
  className={`w-full bg-[#A72020] text-white p-5 rounded-lg flex items-center justify-between ${
    cateringSaladBaseError ? 'ring-4 ring-red-500' : ''
  }`}
>
```

**Cambio sugerido:**
```tsx
<button 
  ref={cateringSaladBaseRef}
  className={`w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between ${
    cateringSaladBaseError ? 'ring-4 ring-red-500' : ''
  }`}
>
```

---

### 3. **Línea 8673: Catering Salad Dressing Selector**
**Contexto:** Banner "2. Choose Dressing" para ensaladas de catering (cp12-cp16)
```tsx
<button 
  ref={cateringSaladDressingRef}
  className={`w-full bg-[#A72020] text-white p-5 rounded-lg flex items-center justify-between ${
    cateringSaladDressingError ? 'ring-4 ring-red-500' : ''
  }`}
>
```

**Cambio sugerido:**
```tsx
<button 
  ref={cateringSaladDressingRef}
  className={`w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between ${
    cateringSaladDressingError ? 'ring-4 ring-red-500' : ''
  }`}
>
```

---

### 4. **Línea 8840: Catering Salad Base (Segunda instancia)**
**Contexto:** Aparece en múltiples productos de catering salad (cp12-cp16)
- Mismo patrón que #2
- Requiere mismo cambio

---

### 5. **Línea 8914: Catering Salad Dressing (Segunda instancia)**
**Contexto:** Aparece en múltiples productos de catering salad (cp12-cp16)
- Mismo patrón que #3
- Requiere mismo cambio

---

### 6. **Línea 9081: Catering Salad Base (Tercera instancia)**
- Mismo patrón que #2 y #4

---

### 7. **Línea 9155: Catering Salad Dressing (Tercera instancia)**
- Mismo patrón que #3 y #5

---

### 8. **Línea 9330: Catering Salad Base (Cuarta instancia)**
- Mismo patrón que anteriores

---

### 9. **Línea 9404: Catering Salad Dressing (Cuarta instancia)**
- Mismo patrón que anteriores

---

### 10. **Línea 9571: Catering Salad Base (Quinta instancia)**
- Mismo patrón que anteriores

---

### 11. **Línea 9645: Catering Salad Dressing (Quinta instancia)**
- Mismo patrón que anteriores

---

### 12. **Línea 9748: Catering Salad Base (Sexta instancia)**
- Mismo patrón que anteriores

---

### 13. **Línea 9822: Catering Salad Dressing (Sexta instancia)**
- Mismo patrón que anteriores

---

### 14. **Línea 9990: Catering Salad Base (Séptima instancia)**
- Mismo patrón que anteriores

---

### 15. **Línea 10064: Catering Salad Dressing (Séptima instancia)**
- Mismo patrón que anteriores

---

### 16. **Línea 10231: Hoagie Platter Selector**
**Contexto:** Banner "1. Make Your Selections" para platter hp1
```tsx
<button 
  ref={hoagiePlatterRef}
  className={`w-full bg-[#A72020] text-white p-5 rounded-lg flex items-center justify-between ${
    hoagiePlatterError ? 'ring-4 ring-red-500' : ''
  }`}
>
```

**Cambio sugerido:**
```tsx
<button 
  ref={hoagiePlatterRef}
  className={`w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between ${
    hoagiePlatterError ? 'ring-4 ring-red-500' : ''
  }`}
>
```

---

### 17. **Línea 10452: Wrap Platter Selector**
**Contexto:** Banner "1. Make Your Selections" para platter wp1
```tsx
<button 
  ref={wrapPlatterRef}
  className={`w-full bg-[#A72020] text-white p-5 rounded-lg flex items-center justify-between ${
    wrapPlatterError ? 'ring-4 ring-red-500' : ''
  }`}
>
```

**Cambio sugerido:**
```tsx
<button 
  ref={wrapPlatterRef}
  className={`w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between ${
    wrapPlatterError ? 'ring-4 ring-red-500' : ''
  }`}
>
```

---

### 18. **Línea 10541: Wrap Type Selector**
**Contexto:** Banner "2. Choose Wrap Type" para platter wp1
```tsx
<button 
  ref={wrapPlatterWrapTypeRef}
  className={`w-full bg-[#A72020] text-white p-5 rounded-lg flex items-center justify-between ${
    wrapPlatterWrapTypeError ? 'ring-4 ring-red-500' : ''
  }`}
>
```

**Cambio sugerido:**
```tsx
<button 
  ref={wrapPlatterWrapTypeRef}
  className={`w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between ${
    wrapPlatterWrapTypeError ? 'ring-4 ring-red-500' : ''
  }`}
>
```

---

### 19. **Línea 16031: Wings Special Instructions (wing3)**
**Contexto:** Banner con lógica condicional compleja para wing3
```tsx
<button 
  ref={wingsSpecialInstructionsRef} 
  className={`w-full bg-[#A72020] text-white p-5 rounded-lg flex items-center justify-between ${
    product.id === 'wing3' ? '' : (wingsSpecialInstructionsError ? 'ring-4 ring-red-500' : '')
  }`}
>
```

**Cambio sugerido:**
```tsx
<button 
  ref={wingsSpecialInstructionsRef} 
  className={`w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between ${
    product.id === 'wing3' ? '' : (wingsSpecialInstructionsError ? 'ring-4 ring-red-500' : '')
  }`}
>
```

---

## 📊 RESUMEN

**Total de casos con template strings:** 19  
**Patrón común:** Todos tienen:
- `className={...}` con template string
- Lógica condicional para errores (`ring-4 ring-red-500`)
- `ref={...}` para validación

**Cambio requerido en todos:**
- `bg-[#A72020]` → `bg-[#F5F3EB]`
- `text-white` → `text-[#1F2937]`
- Mantener toda la lógica condicional intacta

---

## ✅ SIGUIENTE PASO

1. Aplicar el patch principal: `git apply toppings-banners.patch`
2. Hacer estos 19 cambios manualmente uno por uno
3. Verificar visualmente en UI que todos los banners son color crema (#F5F3EB)
