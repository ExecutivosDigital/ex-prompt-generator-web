import { api } from './client';

interface PaymentResult {
  payment_id: string;
  status: string;
  amount: number;
  billing_type: string;
  invoice_url: string;
  pix: {
    payload: string;
    encoded_image: string;
    expiration_date: string;
  } | null;
}

interface PaymentStatus {
  id: string;
  status: string;
  amount: number;
  method: string;
  confirmed_at: string | null;
}

interface CouponResult {
  code: string;
  discount: number;
}

export async function createPayment(data: {
  billingType: 'PIX' | 'CREDIT_CARD';
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  amount: number;
  orderBump?: boolean;
  couponCode?: string;
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
}) {
  return api.post<PaymentResult>('/checkout', data);
}

export async function getPaymentStatus(paymentId: string) {
  return api.get<PaymentStatus>(`/checkout/${paymentId}/status`);
}

export async function validateCoupon(code: string) {
  return api.post<CouponResult>('/checkout/validate-coupon', { code });
}
