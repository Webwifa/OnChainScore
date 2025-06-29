import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { History, Filter, Search, ExternalLink, ArrowUpRight, ArrowDownLeft, Repeat, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'stake' | 'unstake' | 'governance' | 'nft';
  amount: number;
  token: string;
  counterparty?: string;
  protocol?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  txHash: string;
  scoreImpact?: number;
  description: string;
}

interface TransactionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  isOpen,
  onClose,
  transactions
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'impact'>('date');

  useEffect(() => {
    if (!modalRef.current || !backdropRef.current) return;

    if (isOpen) {
      gsap.fromTo(modalRef.current,
        { scale: 0, opacity: 0, y: 100 },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0,
          duration: 0.6, 
          ease: "back.out(1.7)" 
        }
      );

      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );

      if (listRef.current) {
        const items = listRef.current.children;
        gsap.fromTo(items,
          { opacity: 0, x: -30 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.4, 
            stagger: 0.05, 
            delay: 0.3,
            ease: "power2.out" 
          }
        );
      }
    } else {
      gsap.to(modalRef.current, {
        scale: 0,
        opacity: 0,
        y: 100,
        duration: 0.4,
        ease: "power2.in"
      });

      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3
      });
    }
  }, [isOpen]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUpRight className="w-5 h-5 text-red-400" />;
      case 'receive': return <ArrowDownLeft className="w-5 h-5 text-green-400" />;
      case 'swap': return <Repeat className="w-5 h-5 text-blue-400" />;
      case 'stake': return <TrendingUp className="w-5 h-5 text-purple-400" />;
      case 'unstake': return <TrendingDown className="w-5 h-5 text-orange-400" />;
      case 'governance': return <Calendar className="w-5 h-5 text-yellow-400" />;
      default: return <History className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10';
      case 'pending': return 'text-yellow-400 bg-yellow-500/10';
      case 'failed': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const filteredTransactions = transactions
    .filter(tx => filter === 'all' || tx.type === filter)
    .filter(tx => 
      searchTerm === '' || 
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.protocol?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount': return b.amount - a.amount;
        case 'impact': return (b.scoreImpact || 0) - (a.scoreImpact || 0);
        default: return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

  if (!isOpen) return null;

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <History className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Transaction History</h2>
              <p className="text-gray-300">Complete record of your on-chain activity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
          >
            <ExternalLink className="w-6 h-6 text-white rotate-45" />
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50"
              />
            </div>
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400/50"
          >
            <option value="all">All Types</option>
            <option value="send">Send</option>
            <option value="receive">Receive</option>
            <option value="swap">Swap</option>
            <option value="stake">Stake</option>
            <option value="governance">Governance</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'impact')}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400/50"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="impact">Sort by Score Impact</option>
          </select>
        </div>

        {/* Transaction List */}
        <div className="flex-1 overflow-y-auto">
          <div ref={listRef} className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="group p-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl hover:border-blue-400/30 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-white font-medium">{transaction.description}</h4>
                        <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </div>
                        {transaction.scoreImpact && (
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            transaction.scoreImpact > 0 
                              ? 'text-green-400 bg-green-500/10' 
                              : 'text-red-400 bg-red-500/10'
                          }`}>
                            {transaction.scoreImpact > 0 ? '+' : ''}{transaction.scoreImpact} pts
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                        <span>{new Date(transaction.timestamp).toLocaleString()}</span>
                        {transaction.protocol && (
                          <span>via {transaction.protocol}</span>
                        )}
                        <button
                          onClick={() => window.open(`https://dashboard.internetcomputer.org/transaction/${transaction.txHash}`, '_blank')}
                          className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      transaction.type === 'receive' ? 'text-green-400' : 
                      transaction.type === 'send' ? 'text-red-400' : 'text-white'
                    }`}>
                      {transaction.type === 'send' ? '-' : transaction.type === 'receive' ? '+' : ''}
                      {transaction.amount.toLocaleString()} {transaction.token}
                    </div>
                    {transaction.counterparty && (
                      <div className="text-sm text-gray-400 font-mono">
                        {transaction.counterparty.slice(0, 8)}...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">No Transactions Found</h3>
              <p className="text-gray-400">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Your transaction history will appear here once you start using the platform'
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">{transactions.length}</div>
              <div className="text-sm text-gray-400">Total Transactions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">
                {transactions.reduce((sum, tx) => sum + (tx.scoreImpact || 0), 0)}
              </div>
              <div className="text-sm text-gray-400">Total Score Impact</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">
                {new Set(transactions.map(tx => tx.protocol).filter(Boolean)).size}
              </div>
              <div className="text-sm text-gray-400">Protocols Used</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;