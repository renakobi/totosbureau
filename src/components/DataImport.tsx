import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, XCircle, Download, AlertTriangle } from 'lucide-react';
import { parseFileData, parseCSV, parseJSON, validateProductData, ParsedProduct, sampleCSV, sampleJSON } from '@/utils/dataParser';

interface DataImportProps {
  onImport: (products: ParsedProduct[]) => void;
  existingProducts: any[];
}

const DataImport: React.FC<DataImportProps> = ({ onImport, existingProducts }) => {
  const [importMethod, setImportMethod] = useState<'file' | 'csv' | 'json'>('file');
  const [csvData, setCsvData] = useState('');
  const [jsonData, setJsonData] = useState('');
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [validation, setValidation] = useState<{ valid: ParsedProduct[], invalid: any[] } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const products = await parseFileData(file);
      setParsedProducts(products);
      const validationResult = validateProductData(products);
      setValidation(validationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCSVParse = () => {
    if (!csvData.trim()) {
      setError('Please enter CSV data');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const products = parseCSV(csvData);
      setParsedProducts(products);
      const validationResult = validateProductData(products);
      setValidation(validationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleJSONParse = () => {
    if (!jsonData.trim()) {
      setError('Please enter JSON data');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const data = JSON.parse(jsonData);
      const products = Array.isArray(data) ? parseJSON(data) : parseJSON([data]);
      setParsedProducts(products);
      const validationResult = validateProductData(products);
      setValidation(validationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse JSON');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (validation?.valid) {
      onImport(validation.valid);
      setParsedProducts([]);
      setValidation(null);
      setCsvData('');
      setJsonData('');
      setError(null);
    }
  };

  const downloadSample = (type: 'csv' | 'json') => {
    const data = type === 'csv' ? sampleCSV : JSON.stringify(sampleJSON, null, 2);
    const blob = new Blob([data], { type: type === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample_products.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Product Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Import Method Selection */}
          <div className="space-y-4">
            <Label>Import Method</Label>
            <div className="flex gap-4">
              <Button
                variant={importMethod === 'file' ? 'default' : 'outline'}
                onClick={() => setImportMethod('file')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Upload File
              </Button>
              <Button
                variant={importMethod === 'csv' ? 'default' : 'outline'}
                onClick={() => setImportMethod('csv')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Paste CSV
              </Button>
              <Button
                variant={importMethod === 'json' ? 'default' : 'outline'}
                onClick={() => setImportMethod('json')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Paste JSON
              </Button>
            </div>
          </div>

          {/* File Upload */}
          {importMethod === 'file' && (
            <div className="space-y-4">
              <Label>Upload File</Label>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadSample('csv')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Sample
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadSample('json')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download JSON Sample
                </Button>
              </div>
            </div>
          )}

          {/* CSV Input */}
          {importMethod === 'csv' && (
            <div className="space-y-4">
              <Label>CSV Data</Label>
              <Textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="Paste your CSV data here..."
                rows={10}
                disabled={isProcessing}
              />
              <Button onClick={handleCSVParse} disabled={isProcessing}>
                {isProcessing ? 'Parsing...' : 'Parse CSV'}
              </Button>
            </div>
          )}

          {/* JSON Input */}
          {importMethod === 'json' && (
            <div className="space-y-4">
              <Label>JSON Data</Label>
              <Textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder="Paste your JSON data here..."
                rows={10}
                disabled={isProcessing}
              />
              <Button onClick={handleJSONParse} disabled={isProcessing}>
                {isProcessing ? 'Parsing...' : 'Parse JSON'}
              </Button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Validation Results */}
          {validation && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">
                    Valid: {validation.valid.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">
                    Invalid: {validation.invalid.length}
                  </span>
                </div>
              </div>

              {/* Valid Products Preview */}
              {validation.valid.length > 0 && (
                <div className="space-y-2">
                  <Label>Valid Products ({validation.valid.length})</Label>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {validation.valid.slice(0, 5).map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm font-medium">{product.name}</span>
                        <Badge variant="secondary">${product.price}</Badge>
                      </div>
                    ))}
                    {validation.valid.length > 5 && (
                      <div className="text-sm text-muted-foreground text-center">
                        ... and {validation.valid.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Invalid Products */}
              {validation.invalid.length > 0 && (
                <div className="space-y-2">
                  <Label>Invalid Products ({validation.invalid.length})</Label>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {validation.invalid.slice(0, 3).map((item, index) => (
                      <div key={index} className="p-2 bg-red-50 rounded">
                        <div className="text-sm font-medium">{item.product.name || 'Unnamed'}</div>
                        <div className="text-xs text-red-600">
                          {item.errors.join(', ')}
                        </div>
                      </div>
                    ))}
                    {validation.invalid.length > 3 && (
                      <div className="text-sm text-muted-foreground text-center">
                        ... and {validation.invalid.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Import Button */}
              {validation.valid.length > 0 && (
                <Button onClick={handleImport} className="w-full">
                  Import {validation.valid.length} Products
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataImport;
