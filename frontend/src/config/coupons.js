const coupons = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 100000,
    description: 'Get 10% off on your first order',
    minPurchase: 500,
    maxDiscount: 100000,
    isActive: true
  },
  {
    code: 'FLAT50',
    type: 'fixed',
    value: 50000,
    description: 'Get ₹50000 off on your order',
    minPurchase: 200,
    maxDiscount: 50000,
    isActive: true
  },
  {
    code: 'SUMMER25',
    type: 'percentage',
    value: 25000,
    description: 'Get 25000 off on orders above ₹1000',
    minPurchase: 1000,
    maxDiscount: 2000,
    isActive: true
  }
];

const validateCoupon = (code, totalAmount) => {
  const coupon = coupons.find(c => c.code === code && c.isActive);
  
  if (!coupon) {
    return {
      valid: false,
      message: 'Invalid or inactive coupon code'
    };
  }

  if (totalAmount < coupon.minPurchase) {
    return {
      valid: false,
      message: `Minimum purchase amount of ₹${coupon.minPurchase} required`
    };
  }

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (totalAmount * coupon.value) / 100;
    discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = Math.min(coupon.value, totalAmount);
  }

  return {
    valid: true,
    coupon,
    discount,
    finalAmount: totalAmount - discount
  };
};

export { coupons, validateCoupon }; 