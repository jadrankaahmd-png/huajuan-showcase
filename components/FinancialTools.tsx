import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Chip,
  Grid,
} from '@mui/material';
import {
  TrendingUp,
  CompareArrows,
  Search,
  ShowChart,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function FinancialTools() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  // 财报快速扫描器
  const [scannerTicker, setScannerTicker] = useState('NVDA');

  // 公司对比分析器
  const [compareTickers, setCompareTickers] = useState('NVDA,AMD,AVGO');

  // SEC关键词追踪器
  const [secTicker, setSecTicker] = useState('NVDA');
  const [secKeyword, setSecKeyword] = useState('AI');

  const handleScanFinancials = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/financial-scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: scannerTicker }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '扫描失败');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareCompanies = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const tickers = compareTickers.split(',').map((t) => t.trim()).filter(Boolean);

      if (tickers.length < 2) {
        throw new Error('需要至少2个股票代码');
      }

      const response = await fetch('/api/company-comparator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '对比失败');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackKeyword = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/sec-keyword-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: secTicker,
          keyword: secKeyword,
          filingType: '10-K',
          years: 5,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '追踪失败');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 4, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          🚀 AI财报分析工具（Financial Datasets API）
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          基于真实财务数据，支持17,000+家公司30年历史数据
        </Typography>

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => {
            setTabValue(newValue);
            setResult(null);
            setError('');
          }}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab icon={<ShowChart />} label="财报快速扫描" />
          <Tab icon={<CompareArrows />} label="公司对比分析" />
          <Tab icon={<Search />} label="SEC关键词追踪" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Alert severity="info" sx={{ mb: 2 }}>
            💡 快速扫描任意公司过去5年财报核心指标：收入增长率、毛利率、净利率、自由现金流、ROE
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="股票代码"
              value={scannerTicker}
              onChange={(e) => setScannerTicker(e.target.value.toUpperCase())}
              placeholder="NVDA"
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleScanFinancials}
              disabled={loading || !scannerTicker}
              startIcon={loading ? <CircularProgress size={20} /> : <TrendingUp />}
            >
              {loading ? '扫描中...' : '开始扫描'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Box>
              <Typography variant="h6" gutterBottom>
                📊 {result.ticker} 过去5年财报核心指标
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        📈 收入增长率
                      </Typography>
                      {result.metrics.revenueGrowth.map((item: any, idx: number) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                          <Typography variant="body2">{item.year}</Typography>
                          <Chip
                            label={`${item.value.toFixed(2)}%`}
                            size="small"
                            color={item.value > 0 ? 'success' : 'error'}
                          />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        💰 毛利率
                      </Typography>
                      {result.metrics.grossMargin.map((item: any, idx: number) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                          <Typography variant="body2">{item.year}</Typography>
                          <Chip label={`${item.value.toFixed(2)}%`} size="small" color="primary" />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        💵 净利率
                      </Typography>
                      {result.metrics.netMargin.map((item: any, idx: number) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                          <Typography variant="body2">{item.year}</Typography>
                          <Chip
                            label={`${item.value.toFixed(2)}%`}
                            size="small"
                            color={item.value > 0 ? 'success' : 'error'}
                          />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        📊 ROE（净资产收益率）
                      </Typography>
                      {result.metrics.roe.map((item: any, idx: number) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                          <Typography variant="body2">{item.year}</Typography>
                          <Chip label={`${item.value.toFixed(2)}%`} size="small" color="secondary" />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Alert severity="info" sx={{ mb: 2 }}>
            💡 对比多家公司财务表现：收入规模、增长率、利润率、ROE
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="股票代码（逗号分隔）"
              value={compareTickers}
              onChange={(e) => setCompareTickers(e.target.value.toUpperCase())}
              placeholder="NVDA,AMD,AVGO"
              sx={{ flex: 1 }}
              helperText="输入至少2个股票代码"
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleCompareCompanies}
              disabled={loading || compareTickers.split(',').length < 2}
              startIcon={loading ? <CircularProgress size={20} /> : <CompareArrows />}
            >
              {loading ? '对比中...' : '开始对比'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Box>
              <Typography variant="h6" gutterBottom>
                📊 公司对比分析
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        💰 收入规模（$B）
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {result.comparison.map((item: any, idx: number) => (
                          <Box key={idx} sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="primary">
                              {item.ticker}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                              ${(item.revenue / 1e9).toFixed(2)}B
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        💎 毛利率对比
                      </Typography>
                      {result.comparison.map((item: any, idx: number) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                          <Typography variant="body1">{item.ticker}</Typography>
                          <Chip label={`${item.grossMargin.toFixed(2)}%`} size="small" color="primary" />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        📊 ROE 对比
                      </Typography>
                      {result.comparison.map((item: any, idx: number) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                          <Typography variant="body1">{item.ticker}</Typography>
                          <Chip label={`${item.roe.toFixed(2)}%`} size="small" color="secondary" />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Alert severity="info" sx={{ mb: 2 }}>
            💡 追踪 SEC 文件中关键词出现频率趋势，发现公司战略变化
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="股票代码"
              value={secTicker}
              onChange={(e) => setSecTicker(e.target.value.toUpperCase())}
              placeholder="NVDA"
              sx={{ flex: 1 }}
            />
            <TextField
              label="关键词"
              value={secKeyword}
              onChange={(e) => setSecKeyword(e.target.value)}
              placeholder="AI"
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleTrackKeyword}
              disabled={loading || !secTicker || !secKeyword}
              startIcon={loading ? <CircularProgress size={20} /> : <Search />}
            >
              {loading ? '追踪中...' : '开始追踪'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Box>
              <Typography variant="h6" gutterBottom>
                📊 "{result.keyword}" 关键词趋势（{result.ticker}）
              </Typography>

              <Alert severity="success" sx={{ mb: 2 }}>
                总计出现：<strong>{result.totalCount}</strong> 次
                {result.trendDirection === 'increasing' && ' 🚀 快速增长'}
                {result.trendDirection === 'decreasing' && ' 📉 快速下降'}
                {result.trendDirection === 'stable' && ' ➡️ 趋势稳定'}
              </Alert>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    年度出现次数
                  </Typography>
                  {result.trend.map((item: any, idx: number) => {
                    const barLength = Math.min(item.count / 10, 20);
                    return (
                      <Box key={idx} sx={{ py: 1 }}>
                        <Typography variant="body2">
                          {item.year} ({item.type}): {'█'.repeat(barLength)} {item.count}次
                        </Typography>
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            </Box>
          )}
        </TabPanel>
      </CardContent>
    </Card>
  );
}
