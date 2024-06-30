'use client'
import { Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import React, { ForwardedRef } from "react"
import "../app/print.css";

function PrintTable(props: any, ref: ForwardedRef<unknown>) {
  return (
    <div id='stockRequestForm' ref={ref}>
      <Text fontSize='24px' textAlign='center' paddingBottom='15px'>STOCK REQUEST FORM</Text>
      <table width='100%' id="stockRequestFormHeading">
        <tbody>
          <tr>
            <td>REQUESTED BY:</td>
            <td></td>
            <td>PREPARED BY:</td>
            <td></td>
          </tr>
          <tr>
            <td>REQUEST TIME:</td>
            <td></td>
            <td>PREPARED TIME:</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <table width='100%' id="stockRequestFormBody">
        <tbody>
          <tr>
            <td>NO</td>
            <td>ITEM BARCODE</td>
            <td>ITEM DESCRIPTION</td>
            <td>QTY</td>
            <td>UOM</td>
            <td>REMARKS</td>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>6</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export const StockRequestPrint = React.forwardRef(PrintTable);