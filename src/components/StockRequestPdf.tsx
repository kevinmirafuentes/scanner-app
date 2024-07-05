'use state';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center', 
    fontWeight: 'bold',
    marginBottom: '20px',
    fontSize: '14px'
  },
  page: {
    flexDirection: 'column',
    display: 'flex',
    padding: '20px',
    fontSize: '12px', 
  },
  vstack: {
    display: 'flex',
    flexDirection: 'column',
  },
  hstack: {
    display: 'flex',
    flexDirection: 'row',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  table: {
    borderBottom: '1px solid #000',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid #000',
    borderRight: 0,
    borderBottom: 0,
  },
  tableCell: {
    borderRight: '1px solid #000',
    width: '100%',
    padding: '3px 5px'
  },
});

export default function StockRequestPdf ({id}: { id?: number}) {
  let [items, setItems] = useState<any[]>([]);
  const maxItems = 20;

  useEffect(() => {
    let temp = [];
    for (let i=0; i<maxItems; i++) {
      let item = {
        number: i+1,
        barcode: '123123',
        name: 'Sample item', 
        qty: 1,
        inv: 1,
        uom: 'AA',
        remarks: 'test'
      };
      temp.push(item)
    }

    setItems(temp)
    
  }, []);

  return (
    <Document
      title={`Stock Request Form ${id}`}
    >
      <Page 
        size="A4" 
        style={styles.page}
      >
        <View style={{...styles.vstack, gap: '10px'}}>
          <View style={styles.title}>
            <Text>STOCK REQUEST FORM</Text>
          </View>
          
          <View style={{...styles.hstack, ...styles.justifyBetween}}>
            <View style={{...styles.vstack, width: '100%'}}>
              <View style={styles.hstack}>
                <View style={{width: '120px'}}><Text>REQUESTED BY:</Text></View>
                <View><Text>John Doe</Text></View>
              </View>
              <View style={styles.hstack}>
                <View style={{width: '120px'}}><Text>REQUEST TIME:</Text></View>
                <View><Text>2024-01-01 00:00:00</Text></View>
              </View>
            </View>
            <View style={{...styles.vstack, width: '100%'}}>
              <View style={styles.hstack}>
                <View style={{width: '120px'}}><Text>PREPARED BY:</Text></View>
                <View><Text>John Doe</Text></View>
              </View>
              <View style={styles.hstack}>
                <View style={{width: '120px'}}><Text>PREPARED TIME:</Text></View>
                <View><Text>2024-01-01 00:00:00</Text></View>
              </View>
            </View>
          </View>

          <View style={{...styles.vstack, ...styles.table}}>
              <View style={{...styles.tableRow}}>
                <View style={{...styles.tableCell, width: '50px', flexShrink: '0'}}>NO.</View>
                <View style={styles.tableCell}>ITEM BARCODE</View>
                <View style={styles.tableCell}>ITEM DESCRIPTION</View>
                <View style={{...styles.tableCell, width: '50px', flexShrink: '0'}}>QTY</View>
                <View style={{...styles.tableCell, width: '50px', flexShrink: '0'}}>INV</View>
                <View style={{...styles.tableCell, width: '50px', flexShrink: '0'}}>UOM</View>
                <View style={styles.tableCell}>REMARKS</View>
              </View>
              {items.map((i, k) => (
                <View key={k} style={{...styles.tableRow}}>
                  <View style={{...styles.tableCell, width: '50px', flexShrink: '0'}}>{i.number}</View>
                  <View style={styles.tableCell}>{i.barcode}</View>
                  <View style={styles.tableCell}>{i.name}</View>
                  <View style={{...styles.tableCell, width: '50px', flexShrink: '0'}}>{i.qty}</View>
                  <View style={{...styles.tableCell, width: '50px', flexShrink: '0'}}>{i.inv}</View>
                  <View style={{...styles.tableCell, width: '50px', flexShrink: '0'}}>{i.uonm}</View>
                  <View style={styles.tableCell}>{i.remarks}</View>
                </View>
              ))}
          </View>
       </View> 
      </Page>
    </Document>
  )
}