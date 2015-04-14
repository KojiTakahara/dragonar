package dragonar;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.io.IOException;
import javax.servlet.http.*;

public class GenerateDMSheet extends HttpServlet {

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
        response.setHeader("Access-Control-Allow-Origin", "*");

        // get parameter
        String[] mainDeck = request.getParameterValues("mainDeck");
        String[] hyperSpatial = request.getParameterValues("hyperSpatial");
        String playerName = request.getParameter("playerName");
        if (hyperSpatial == null) {
            hyperSpatial = new String[]{};
        }
        // validate
        if (!validate(mainDeck, hyperSpatial, playerName)) {
            setBadRequestResponse(response);
            return;
        }

        try {
            PdfReader reader = new PdfReader("decksheet.pdf");
            PdfStamper pdfStamper = new PdfStamper(reader, response.getOutputStream());

            BaseFont bf = BaseFont.createFont("HeiseiKakuGo-W5", "UniJIS-UCS2-H", BaseFont.NOT_EMBEDDED);

            PdfContentByte over = pdfStamper.getOverContent(1);
            over.beginText();

            //writeText(over, bf, "奮戦の精霊龍 デコデッコ・デコリアーヌ・ピッカピカⅢ世", 80, 90);
            //writeText(over, bf, "アクア・カスケード〈ZABUUUN・クルーザー〉", 350, 90);
            writeHyperSpatial(over, bf, hyperSpatial);

            over.endText();
            pdfStamper.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        response.setContentType("application/pdf");
    }

    private void setBadRequestResponse(HttpServletResponse response) throws IOException {
        response.getWriter().println("bad request");
        response.setContentType("application/json");
        response.setStatus(400);
    }

    private void writeHyperSpatial(PdfContentByte over, BaseFont bf, String[] hyperSpatial) {
        int x = 80;
        for (int i = 0; i < hyperSpatial.length; i++) {
            if (4 < i) {
                x = 350;
            }
            writeText(over, bf, hyperSpatial[i], x, 90);
        }
    }

    private void writeText(PdfContentByte over, BaseFont bf, String text, int x, int y) {
        over.setFontAndSize(bf, getFontSize(text));
        over.showTextAligned(Element.ALIGN_TOP, text, x, y, 0);
    }

    private int getFontSize(String text) {
        int length = text.length();
        if (24 < length) {
            return 8;
        }
        if (17 < length) {
            return 10;
        }
        return 12;
    }

    private boolean validate(String[] mainDeck, String[] hyperSpatial, String playerName) {
        System.out.println(mainDeck);
        System.out.println(playerName);
        if (mainDeck == null || playerName == null || playerName == "") {
            return false;
        }

        if (mainDeck.length != 40) {
            return false;
        }
        if (8 < hyperSpatial.length) {
            return false;
        }
        return true;
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
        resp.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    }

}
