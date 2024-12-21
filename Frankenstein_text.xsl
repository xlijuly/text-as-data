<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs tei"
    version="2.0">
    
    <!-- <xsl:output method="xml" omit-xml-declaration="yes" indent="yes" /> -->
    <xsl:template match="tei:teiHeader"/>

    <xsl:template match="tei:body">
            <div class="transcription">
                <xsl:apply-templates select="//tei:div"/>
            </div>
    </xsl:template>
    
    <xsl:template match="tei:div">
        <div class="#MWS">
            <xsl:apply-templates/>
        </div>
    </xsl:template>

    <xsl:template match="tei:p">
    <p>
        <xsl:if test="@class">
            <xsl:attribute name="class"> <!-- for paragraphs without indentation -->
                <xsl:value-of select="@class"/>
            </xsl:attribute>
        </xsl:if>
        <xsl:apply-templates/>
    </p>
    </xsl:template>
    
    <xsl:template match="tei:del">
    <del class="del">
        <xsl:attribute name="class">
            <xsl:value-of select="concat('del ', @hand)"/>
        </xsl:attribute>
        <xsl:apply-templates/>
    </del>
    </xsl:template>
    
    <!-- chapter number in 21r: -->
    <xsl:template match="tei:head">
        <div class="centered">
            <xsl:attribute name="class">
                <xsl:value-of select="concat('centered ', @hand)"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </div>
    </xsl:template>

    <!-- linebreaks: -->
    <xsl:template match="tei:lb">
        <br/>
    </xsl:template>
    
    <!-- base text (by Mary) for the selectHand function: -->
    <xsl:template match="text()[ancestor::tei:p and not(ancestor::*[@hand='#PBS'])]">
    <span class="MWS-base">
        <xsl:value-of select="."/>
    </span>
    </xsl:template>

    <!-- additions: -->
    <xsl:template match="tei:add[@place = 'supralinear']">
    <span>
        <xsl:attribute name="class">
            <xsl:value-of select="concat('supraAdd ', @hand)"/>
        </xsl:attribute>
        <xsl:apply-templates/>
    </span>
    </xsl:template>

    <xsl:template match="tei:add[@place = 'infralinear']">
    <span>
        <xsl:attribute name="class">
            <xsl:value-of select="concat('infraAdd ', @hand)"/>
        </xsl:attribute>
        <xsl:apply-templates/>
    </span>
    </xsl:template>

    <xsl:template match="tei:add[@place = 'overwritten' or @place = 'inline']">
        <span>
            <xsl:attribute name="class">
                <xsl:value-of select="concat('inlineAdd ', @hand)"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </span>
    </xsl:template>

    <!-- marginal content -->
    <xsl:template match="tei:add[@place='marginleft']">
        <span>
            <xsl:attribute name="class">
                <xsl:value-of select="concat('marginAdd ', @hand)"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </span>
    </xsl:template>

    <!-- marginal supralinear additions -->
    <xsl:template match="tei:add[@place='supralinear'][ancestor::tei:add[@place='marginleft']]">
        <span>
            <xsl:attribute name="class">
                <xsl:value-of select="concat('supraAdd ', @hand)"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </span>
    </xsl:template>

    <!-- marginal deletions -->
    <xsl:template match="tei:del[ancestor::tei:add[@place='marginleft']]">
        <del>
            <xsl:attribute name="class">
                <xsl:value-of select="@hand"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </del>
    </xsl:template>
    
    <!-- superscripts and underlined texts: -->
    <xsl:template match="tei:hi[@rend = 'sup']">
        <sup>
            <xsl:apply-templates/>
        </sup>
    </xsl:template>

    <xsl:template match="tei:hi[@rend = 'u']">
    <u>
        <xsl:apply-templates/>
    </u>
    </xsl:template> 

    <!-- pagenumbers: circled, positioned on the right(r-pages) or the left(v-pages)-->
    <xsl:template match="tei:hi[@rend = 'circled']">
    <span class="circled">
        <xsl:apply-templates/>
    </span>
    </xsl:template>
    
    <xsl:template match="tei:div[@type='page']">
    <div class="{@rend}">
        <xsl:apply-templates/>
    </div>
    </xsl:template>

    <xsl:template match="tei:metamark[@function='pagenumber']">
        <xsl:choose>
            <xsl:when test="ancestor::tei:div[@rend='recto']">
                <span class="pagenumber recto">
                    <xsl:apply-templates/>
                </span>
            </xsl:when>
            <xsl:when test="ancestor::tei:div[@rend='verso']">
                <span class="pagenumber verso">
                    <xsl:apply-templates/>
                </span>
            </xsl:when>
        </xsl:choose>
    </xsl:template>

    <!-- metamark "^" for insertion-->
    <xsl:template match="tei:metamark[@function='insertion']">
    <span>
        <xsl:attribute name="class">
            <xsl:value-of select="concat('infraAdd ', @hand)"/>
        </xsl:attribute>
        <xsl:apply-templates/>
    </span>
    </xsl:template>

    
</xsl:stylesheet>
