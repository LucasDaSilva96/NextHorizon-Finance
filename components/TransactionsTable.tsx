import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  cn,
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from '@/lib/utils';
import { transactionCategoryStyles } from '@/constants';

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const { backgroundColor, borderColor, chipBackgroundColor, textColor } =
    transactionCategoryStyles[
      category as keyof typeof transactionCategoryStyles
    ] || transactionCategoryStyles.default;
  return (
    <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
    </div>
  );
};

export default function TransactionsTable({
  transactions,
}: TransactionTableProps) {
  return (
    <Table>
      <TableHeader className='bg-[#f9fafb]'>
        <TableRow>
          <TableHead className='px-2'>Transaction</TableHead>
          <TableHead className='px-2'>Amount</TableHead>
          <TableHead className='px-2'>Status</TableHead>
          <TableHead className='px-2'>Date</TableHead>
          <TableHead className='px-2 max-md:hidden'>Channel</TableHead>
          <TableHead className='px-2 max-md:hidden'>Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction: Transaction) => {
          const status = getTransactionStatus(new Date(transaction.date));
          const amount = formatAmount(transaction.amount);
          const isDebit = transaction.type === 'debit';
          const isCredit = transaction.type === 'credit';

          return (
            <TableRow
              key={transaction.id}
              className={`${
                isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'
              } hover:bg-transparent transition-colors duration-150 ease-linear border-b-DEFAULT`}
            >
              <TableCell className='max-w-[250px] pl-2 pr-10'>
                <div className='flex items-center gap-3'>
                  <h1 className='text-14 truncate font-semibold text-[#344054]'>
                    {removeSpecialCharacters(transaction.name)}
                  </h1>
                </div>
              </TableCell>
              <TableCell
                className={`pl-2 pr-10 font-semibold ${
                  isDebit || amount[0] === '-'
                    ? 'text-[#f04438]'
                    : 'text-[#039855]'
                }`}
              >
                {isDebit ? `-${amount}` : isCredit ? amount : amount}
              </TableCell>
              <TableCell className='pl-2 pr-10'>
                <CategoryBadge category={status} />
              </TableCell>
              <TableCell className='max-md:hidden pl-2 pr-10 min-w-32'>
                {formatDateTime(new Date(transaction.date)).dateTime}
              </TableCell>
              <TableCell className='max-md:hidden pl-2 pr-10 capitalize min-w-34'>
                {transaction.paymentChannel || 'N/A'}
              </TableCell>

              <TableCell className=' pl-2 pr-10 max-md:hidden'>
                <CategoryBadge category={transaction.category} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
