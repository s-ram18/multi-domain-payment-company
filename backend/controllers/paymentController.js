import { store } from '../utils/store.js';

export function processPayment(req, res) {
  const { amount, currency, merchantName, cardNumber, expiry, idempotencyKey } = req.body;
  const clientIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';

  const key = idempotencyKey || req.headers['x-idempotency-key'];

  // Check Idempotency Key
  if (key) {
    const existing = store.getIdempotentTransaction(key);
    if (existing) {
      store.addAuditLog({
        userId: req.user ? req.user.id : 'usr_customer_demo',
        userEmail: req.user ? req.user.email : 'alex.morgan@acme-corp.com',
        role: req.user ? req.user.role : 'customer',
        action: 'IDEMPOTENCE_DUPLICATE_CAUGHT',
        category: 'PAYMENT',
        severity: 'INFO',
        ipAddress: clientIp,
        status: 'SUCCESS',
        details: `Duplicate payment request caught by Idempotency Key (${key}). Returned cached transaction.`
      });

      return res.status(200).json({
        duplicateProcessed: true,
        message: 'Duplicate payment request detected by Idempotency key. Returned original cached response.',
        transaction: existing
      });
    }
  }

  // Amount Bounds Validation
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0 || numAmount > 50000) {
    store.addAuditLog({
      userId: req.user ? req.user.id : 'usr_customer_demo',
      userEmail: req.user ? req.user.email : 'alex.morgan@acme-corp.com',
      role: req.user ? req.user.role : 'customer',
      action: 'PAYMENT_VALIDATION_FAILED',
      category: 'PAYMENT',
      severity: 'WARNING',
      ipAddress: clientIp,
      status: 'FAILED',
      details: `Payment initiation rejected. Invalid transaction amount (${amount}). Allowed range: $0.01 - $50,000.00.`
    });

    return res.status(400).json({
      error: 'Bad Request',
      message: '400 Bad Request - Invalid transaction amount. Must be between $0.01 and $50,000.00.',
      code: 'INVALID_AMOUNT'
    });
  }

  // Mask Card Number
  let maskedCard = 'Visa ending in •••• 4242';
  if (cardNumber && typeof cardNumber === 'string') {
    const last4 = cardNumber.replace(/\D/g, '').slice(-4) || '4242';
    maskedCard = `Card ending in •••• ${last4}`;
  }

  const transactionId = `TXN-PAY-${Math.floor(100000 + Math.random() * 900000)}`;

  const newTransaction = {
    id: transactionId,
    customerId: req.user ? req.user.id : 'usr_customer_demo',
    customerName: req.user ? req.user.name : 'Alex Morgan',
    merchantName: merchantName || 'Demo Merchant Services',
    amount: numAmount,
    currency: currency || 'USD',
    paymentMethod: maskedCard,
    status: 'SUCCESS',
    riskScore: Math.floor(Math.random() * 20) + 5,
    idempotencyKey: key || `idem_${transactionId}`,
    ipAddress: clientIp,
    timestamp: new Date().toISOString()
  };

  store.addTransaction(newTransaction);

  store.addAuditLog({
    userId: newTransaction.customerId,
    userEmail: req.user ? req.user.email : 'alex.morgan@acme-corp.com',
    role: req.user ? req.user.role : 'customer',
    action: 'PAYMENT_PROCESSED_SUCCESS',
    category: 'PAYMENT',
    severity: 'INFO',
    ipAddress: clientIp,
    status: 'SUCCESS',
    details: `Sandbox payment ${transactionId} processed successfully for $${numAmount.toFixed(2)} ${newTransaction.currency}. Tokenized payment reference stored.`
  });

  return res.status(201).json({
    message: 'Sandbox payment transaction completed successfully.',
    sandboxBanner: 'SANDBOX/DEMO ENVIRONMENT - NO REAL MONEY MOVED',
    transaction: newTransaction
  });
}

export function getTransactions(req, res) {
  const allTxns = store.getAllTransactions();
  
  // If customer role, filter to own transactions
  if (req.user && req.user.role === 'customer') {
    const userTxns = allTxns.filter(t => t.customerId === req.user.id);
    return res.status(200).json({ transactions: userTxns });
  }

  return res.status(200).json({ transactions: allTxns });
}
