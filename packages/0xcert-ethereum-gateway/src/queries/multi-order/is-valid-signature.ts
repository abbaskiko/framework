import { MultiOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createOrderHash, createSignatureTuple } from '../../lib/multi-order';

const functionSignature = '0x8fa76d8d';
const inputTypes = ['address', 'bytes32', 'tuple(bytes32, bytes32, uint8, uint8)'];
const outputTypes = ['bool'];

/**
 * Checks if signature is valid.
 * @param gateway Order gateway instance.
 * @param order Order data.
 * @param claim Claim data.
 */
export default async function(gateway: Gateway, order: MultiOrder, claim: string) {
  const orderHash = createOrderHash(gateway, order);
  const signatureTuple = createSignatureTuple(claim);
  try {
    const attrs = {
      to: gateway.config.multiOrderId,
      data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [order.makerId, orderHash, signatureTuple]).substr(2),
    };
    const res = await gateway.provider.post({
      method: 'eth_call',
      params: [attrs, 'latest'],
    });
    return gateway.provider.encoder.decodeParameters(outputTypes, res.result)[0];
  } catch (error) {
    return null;
  }
}
